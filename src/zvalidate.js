/**
 * ZValidate - Um simples validador de formulários
 *
 * @license http://www.opensource.org/licenses/mit-license.php The MIT License
 * @author: Bruno Silva | eu@brunoziie.com
 **/
(function (window, jQ) {
    'use strict';

    var callbacks = {},
        rules,
        zValidate,
        API = {};

    // Regras de validacão padrão
    rules = {
        /**
         * Define que o campo não pode ser vazio
         * @return {Boolean} Verdadeiro caso o campo for preenchido
         */
        required: function () {
            var string = this.value;
            return (typeof string === 'string' && string.length > 0) ? true : false;
        },

        /**
         * Define que o campo deve conter um endereço de email
         * @return {Boolean} Verdadeiro caso o campo contenha um email
         */
        email: function () {        
            var string = this.value,
                filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

            return (filter.test(string)) ? true : false;
        },

        /**
         * Define que o campo deve conter o numero inteiro
         * @return {Boolean} Verdadeiro caso o campo contenha um numero inteiro
         */
        integer: function () {
            var string = this.value,
                filter = /^[0-9]+$/;

            return (filter.test(string)) ? true : false;
        },

        /**
         * Define que o campo deve conter um numero decimal
         * @return {Boolean} Verdadeiro caso o campo contenha um numero decimal
         */
        decimal: function () {
            var string = this.value,
                filter = /[\-]?[0-9]+(\.|\,)[0-9]+$/;

            return (filter.test(string)) ? true : false;
        },

        /**
         * Define que o campo deve conter um numero minimo de caracteres
         * @param  {Integer} min Numero minimo de caracteres
         * @return {Boolean}     Verdadeiro caso o campo contenha o numero minimo de caracteres exigidos
         */
        minLength: function (min) {
            var string = this.value;
            return (string.length >= min) ? true : false;
        },

        /**
         * Define que o campo deve conter ate um numero maximo de caracteres
         * @param  {Integer} max Numero maximo de caracteres permitidos
         * @return {Boolean}     Verdadeiro caso o campo contenha o numero de caracteres igual ou inferir ao exigidos
         */
        maxLength: function (max) {
            var string = this.value;
            return (string.length <= max) ? true : false;
        },

        /**
         * Define que o campo deve conter uma data válida
         * @param  {String}  format Formato da data (Ymd ou dmY)
         * @return {Boolean}        Verdadeiro caso contenha uma data válida
         */
        date: function (format) {
            var string = this.value,
                dateFormat = format || 'Ymd',
                dateString = string,
                compare,
                parse,
                day,
                month,
                dateParts;

            if (dateFormat !== 'Ymd' && dateFormat !== 'dmY') {
                return false;
            }

            if (dateFormat === 'dmY') {
                dateParts = dateString.replace(/[\/\-]/g, '-').split('-');
                dateString = [dateParts[2], dateParts[1], dateParts[0]].join('/');
            }

            parse = new Date(dateString);

            if (parse.toString() === 'Invalid Date') {
                return false;
            }

            day = ((parse.getUTCDate()) < 10) ? '0' + parse.getUTCDate() : parse.getUTCDate();
            month = ((parse.getMonth() + 1) < 10) ? '0' + (parse.getMonth() + 1) : (parse.getMonth() + 1);
            compare = [parse.getUTCFullYear(), month, day].join('/');

            return (compare === dateString) ? true : false;
        },

        /**
         * Define que o campo deve um endereço IP
         * @return {Boolean} Verdadeiro caso o campo contenha um endereço IP
         */
        ip: function () {
            var string = this.value,
                filter = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;

            return (filter.test(string)) ? true : false;
        },

        /**
         * Define que o campo deve conter uma URL válida
         * @return {Boolean} Verdadeiro caso contenha uma URL válida
         */
        url: function () {
            var string = this.value,
                filter = /((http|https):\/\/(\w+:{0,1}\w*@)?(\S+)|)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

            return (string.length > 0 && filter.test(string)) ? true : false;
        },

        /**
         * Define que o campo deve ter o valor igual ao valor de um outro campo definido
         * @param  {String}  elementId Id do elemento que o valor será comparado
         * @return {Boolean}           Verdadeiro caso ambos os campos tenham o mesmo valor
         */
        equals: function (elementId) {
            var string = this.value,
                input = window.document.getElementById(elementId),
                result;

            if (input !== null) {
                result = (string === input.value) ? true : false;
            } else {
                result = false;
            }

            return result;
        },

        /**
         * Define que o campo do tipo radio ou checkbox deve ser selecionado
         * @return {Boolean} Verdadeiro caso um item esteja selecionado
         */
        checked: function () {
            var name = this.name,
                input = window.document.getElementsByName(name),
                len = input.length,
                i;

            if (len > 0) {
                for (i = 0; i < len; i += 1) {
                    if (input[i].checked) {
                        return true;
                    }
                }
            }

            return false;
        },

        /**
         * Define que o campo deve ser diferente do argumento informado
         * @param  {String}  string Valor do input
         * @param  {String}  arg    Argumento a ser comparado com a string
         * @return {Boolean}        Verdadeiro caso o valor e argumento informado sejam diferentes
         */
        diff: function (arg) {
            return (this.value !== arg) ? true : false;
        }
    };

    // zValidate Core
    zValidate = {
        /**
         * Trata os argumentos de uma regra
         * @param  {String} ruleString Regra definida no campo
         * @return {Array}             Array com o primeiro indice como o nome da regra e o segundo como argumento
         */
        parseArg: function (ruleString) {
            var parts = ruleString.split(':');
            
            return {
                rule: parts[0],
                arguments: parts[1] || null
            };
        },

        /**
         * Gera um tooltip com a mensagem de erro para um campo
         * @param  {Object} form  Formulário que está sendo validado   
         * @param  {Object} input Campo que receberá o tooltip
         * @param  {String} text  Texto que será exibido no tootip (OBS: Se não for definido um texto, será assumido o atributo data-message do input)
         * @return {void}
         */
        generateTooltip: function (form, input, text) {
            var currentInput = jQ(input),
                message = text || currentInput.data('message') || '',
                className = 'z_tooltip',
                inputId = currentInput.attr('id'),
                offsets = currentInput.offset(),
                formOffsets = jQ(form).offset(),
                finalPosition = [offsets.left - formOffsets.left, offsets.top - formOffsets.top],
                id = className + '_' + inputId,
                css = 'top:' + (finalPosition[1] - 35) + 'px;left:' + (finalPosition[0] + currentInput.width() - 40) + 'px;position:absolute',
                html = [
                    '<div id="' + id + '" class="' + className + '" style="' + css + '">',
                    '<span class="z_tooltip_inner">' + message + '</span>',
                    '<span class="z_tooltip_arrow"></span></div>'
                ].join('');

            jQ(form).css('position', 'relative').append(html);
            jQ(input).focus(function () {
                jQ('#' + id).fadeOut(500);
            });
        },

        /**
         * Valida um formulário
         * @param  {Object}  form Formulário que será validado
         * @return {Boolean}      Verdadeiro caso todos os campos do formulário obedeçam as regras definidas
         */
        validate : function (form) {
            var inputList = jQ(form).find('input, select, textarea'),
                len = inputList.length,
                rulesList,
                rulesListLen,
                current,
                currentRule,
                valid,
                args,
                i,
                x,
                output = true;

            jQ(form).find('.z_tooltip').remove();

            for (i = 0; i < len; i += 1) {
                current = jQ(inputList[i]);

                if (current.data('rule') !== undefined && current.css('display') !== 'none') {
                    rulesList = current.data('rule').split('|');
                    rulesListLen = rulesList.length;

                    for (x = 0; x < rulesListLen; x += 1) {
                        currentRule = this.parseArg(rulesList[x]);

                        if (rules[currentRule.rule] !== undefined) {
                            valid = rules[currentRule.rule].apply(current[0], [currentRule.arguments]);

                            if (!valid) {
                                this.generateTooltip(form, current);
                                output = false;
                            }
                        }
                    }
                }
            }

            return output;
        }
    };

    /**
     * Adiciona/Altera uma regra de validação
     * @param  {String}   name     Nome da regra
     * @param  {Function} callback Implementação da regra
     * @return {void}
     */
    API.rule = function (name, extension) {
        if (typeof extension === 'function') {
            rules[name] = extension;
        }
    };

    /**
     * Adiciona/Altera uma função de callback para ser executada apos a validação
     * @param  {String}   id                    Id do formulário
     * @param  {Function} callback              Funçào que será executada apos a validação
     * @param  {Boolean}  callback.result       Resultado da validação
     * @param  {Boolean}  callback.event        Evento de submit do formulário
     * @param  {Object}   callback.formElement  Elemento do formulário que foi validado
     * @return {void}
     */
    API.afterValidate = function (id, callback) {
        if (typeof callback === 'function') {
            callbacks[id] = callback;
        }
    };

    // Aplica a validação aos formulários no evento submit
    jQ(window.document).on('submit', 'form.validate', function (evt) {
        var $this = jQ(this),
            formId = $this[0].id || null,
            result = zValidate.validate($this),
            privateScopeAPI = {
                tooltip: function (input, text) {
                    zValidate.generateTooltip($this, input, text);
                }
            };

        return (formId !== null && callbacks['#' + formId] !== undefined) ? callbacks['#' + formId].call(privateScopeAPI, result, evt, $this) : result;
    });

    // Public API
    window.zValidate = API;
}(this, jQuery));