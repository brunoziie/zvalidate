/**
 * ZValidate - Um simples validador de formulários
 *
 * @license http://www.opensource.org/licenses/mit-license.php The MIT License
 * @author: Bruno Silva | eu@brunoziie.com
 **/
(function (window, $) {
    'use strict';

    var callbacks = {},
        rules,
        zValidate,
        API = {},
        messages = {};

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
        generateTooltip: function (input, text) {
            var tooltip = document.createElement('div'),
                parentNode = input.parentNode;

            tooltip.classList.add('z-tooltip');
            tooltip.innerHTML =  [
                '<div class="z-tooltip-wrapper">',
                '<span class="z-tooltip-inner">' + text + '</span>',
                '<span class="z-tooltip-arrow"></span>',
                '</div>'
            ].join('');

            parentNode.style.position = 'relative';
            parentNode.insertBefore(tooltip, input);

            input.onfocus = function () {
                tooltip.classList.add('hide');

                setTimeout(function () {
                    tooltip.remove();
                }, 300);

                input.onfocus = null;
            }
        },

        /**
         * Valida um formulário
         * @param  {Object}  form Formulário que será validado
         * @return {Boolean}      Verdadeiro caso todos os campos do formulário obedeçam as regras definidas
         */
        validate : function (form) {
            var inputList = form.querySelectorAll('[zv-rule]'),
                len = inputList.length,
                rulesList,
                rulesListLen,
                current,
                currentRule,
                valid,
                args,
                i,
                x,
                rule,
                message,
                output = true;

            this.removeTooltips(form);

            for (i = 0; i < len; i += 1) {
                current = inputList[i];
                rulesList = current.getAttribute('zv-rule').split('|');
                rulesListLen = rulesList.length;

                for (x = 0; x < rulesListLen; x += 1) {
                    currentRule = this.parseArg(rulesList[x]);
                    rule = currentRule.rule;

                    if (rules[rule] !== undefined) {
                        valid = rules[rule].apply(current, [currentRule.arguments]);

                        if (!valid) {
                            message = this.getMessage(current, rule);
                            this.generateTooltip(current, message);
                            output = false;
                        }
                    }
                }
            }

            return output;
        },

        removeTooltips : function (form) {
            var tooltips = form.querySelectorAll('.z-tooltip'),
                len = tooltips.length,
                x;

            for (x = 0; x < len; x += 1) {
                tooltips[x].remove();
            }
        },

        getMessage : function (input, rule) {
            var inline = input.getAttribute('zv-error-' + rule) || input.getAttribute('zv-error');

            if (inline) {
                return inline;
            }

            return messages[rule] || 'error';
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
     * Adiciona/Altera uma função de callback para ser executada quando a validação falha
     * @param  {String}   id                    Id do formulário
     * @param  {Function} callback              Função que será executada apos a validação
     * @param  {Object}   callback.formElement  Elemento do formulário que foi validado
     * @return {void}
     */
    API.onValidationFail = function (id, callback) {
        if (typeof callback === 'function') {
            callbacks[id] = callback;
        }
    };

    API.setMessage = function (key, value) {
        var k, list;

        if (arguments.length === 2) {
            messages[key] = value;
        }

        if (typeof key === 'object') {
            list = key;

            for (k in list) {
                if (list.hasOwnProperty(k)) {
                    messages[k] = list[k];
                }
            }
        }
    }

    // Aplica a validação aos formulários no evento submit
    document.addEventListener('submit', function (evt) {
        if (!evt.target.matches('[z-validate]')) {
            return;
        }

        var form = evt.target,
            result = zValidate.validate(form),
            callbackId = form.getAttribute('zv-on-fail'),
            privateScopeAPI = {
                tooltip: function (input, text) {
                    zValidate.generateTooltip(input, text);
                }
            },
            callback;

        if (callbackId) {
            callback = callbacks[callbackId];

            if (callback) {
                callback.call(privateScopeAPI);
            }
        }

        if (!result) {
            evt.preventDefault();
        }
    });

    // Public API
    window.zValidate = API;
}(this, jQuery));