/**
 * ZValidate - Um simples validador de formulários
 *
 * @license http://www.opensource.org/licenses/mit-license.php The MIT License
 * @author: Bruno Silva | eu@brunoziie.com
 **/
(function (global) {
	'use strict';

	var jQ = global.jQuery,

		// Regras de validacão padrão
		rules = {
			/**
			 * Define que o campo não pode ser vazio
			 * @param  {String}  string Valor do input
			 * @return {Boolean}        Verdadeiro caso o campo for preenchido
			 */
			required : function (string) {
				return (typeof string === 'string' && string.length > 0) ? true : false;
			},

			/**
			 * Define que o campo deve conter um endereço de email
			 * @param  {String}  string Valor do input
			 * @return {Boolean}        Verdadeiro caso o campo contenha um email
			 */
			email : function (string) {
				var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
				return (filter.test(string)) ? true : false;
			},

			/**
			 * Define que o campo deve conter o numero inteiro
			 * @param  {String}  string Valor do input
			 * @return {Boolean}        Verdadeiro caso o campo contenha um numero inteiro
			 */
			integer : function (string) {
				var filter = /^[0-9]+$/;
				return (filter.test(string)) ? true : false;
			},

			/**
			 * Define que o campo deve conter um numero decimal
			 * @param  {String}  string Valor do input
			 * @return {Boolean}        Verdadeiro caso o campo contenha um numero decimal
			 */
			decimal : function (string) {
				var filter = /[\-]?[0-9]+(\.|\,)[0-9]+$/;
				return (filter.test(string)) ? true : false;
			},

			/**
			 * Define que o campo deve conter um numero minimo de caracteres
			 * @param  {String}  string Valor do input
			 * @param  {Integer} min    Numero minimo de caracteres
			 * @return {Boolean}        Verdadeiro caso o campo contenha o numero minimo de caracteres exigidos
			 */
			minLength : function (string, min) {
				return (string.length >= min) ? true : false;
			},

			/**
			 * Define que o campo deve conter ate um numero maximo de caracteres
			 * @param  {String}  string Valor do input
			 * @param  {Integer} max    Numero maximo de caracteres permitidos
			 * @return {Boolean}        Verdadeiro caso o campo contenha o numero de caracteres igual ou inferir ao exigidos
			 */
			maxLength : function (string, max) {
				return (string.length <= max) ? true : false;
			},

			/**
			 * Define que o campo deve conter uma data válida
			 * @param  {String}  string Valor do input
			 * @param  {String}  format Formato da data (Ymd ou dmY)
			 * @return {Boolean}        Verdadeiro caso contenha uma data válida
			 */
			date : function (string, format) {
				var dateFormat = format || 'Ymd',
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
			 * @param  {String}  string Valor do input
			 * @return {Boolean}        Verdadeiro caso o campo contenha um endereço IP
			 */
			ip : function (string) {
				var filter = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
				return (filter.test(string)) ? true : false;
			},

			/**
			 * Define que o campo deve conter uma URL válida
			 * @param  {String}  string Valor do input
			 * @return {Boolean}        Verdadeiro caso contenha uma URL válida
			 */
			url : function (string) {
				var filter = /((http|https):\/\/(\w+:{0,1}\w*@)?(\S+)|)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
				return (string.length > 0 && filter.test(string)) ? true : false;
			},

			/**
			 * Define que o campo deve ter o valor igual ao valor de um outro campo definido
			 * @param  {String}  string    Valor do input
			 * @param  {String}  elementId Id do elemento que o valor será comparado
			 * @return {Boolean}           Verdadeiro caso ambos os campos tenham o mesmo valor
			 */
			equals : function (string, elementId) {
				var input = global.document.getElementById(elementId);

				if (input !== null) {
					return (string === input.value) ? true : false;
				} else {
					return false;
				}
			}
		},

		// zValidate Core
		zValidate = {
			/**
			 * Trata os argumentos de uma regra
			 * @param  {String} ruleString Regra definida no campo
			 * @return {Array}             Array com o primeiro indice como o nome da regra e o segundo como argumento
			 */
			parseArg : function (ruleString) {
				return ruleString.split(':');
			},

			/**
			 * Gera um tooltip com a mensagem de erro para um campo
			 * @param  {Object} input Campo que receberá o tooltip
			 * @return {void}
			 */
			generateTooltip : function (input) {
				var currentInput = jQ(input),
					message = currentInput.data('message') || '',
					className = 'z_tooltip',
					inputId = currentInput.attr('id'),
					offsets = currentInput.offset(),
					id = className + '_' + currentInput.attr('id'),
					css = 'top:' + (offsets.top - 35) + 'px;left:' + (offsets.left + currentInput.width() - 40) + 'px;position:absolute',
					html = [
						'<div id="' + id + '" class="' + className + '" style="' + css + '">',
						'<span class="z_tooltip_inner">' + message + '</span>',
						'<span class="z_tooltip_arrow"></span></div>'
					].join('');

				jQ('body').append(html);
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
					args,
					i,
					x,
					output = true;

				jQ('.z_tooltip').remove();

				for (i = 0; i < len; i++) {
					current = jQ(inputList[i]);

					if (typeof current.data('rule') !== 'undefined') {
						rulesList = current.data('rule').split('|');
						rulesListLen = rulesList.length;

						for (x = 0; x < rulesListLen; x++) {
							currentRule = this.parseArg(rulesList[x]);
							if (typeof rules[currentRule[0]] !== 'undefined') {
								args = currentRule[1] || '';
								if (!rules[currentRule[0]](current.val(), args)) {
									this.generateTooltip(current);
									output = false;
								}
							}
						}
					}
				}

				return output;
			},

			/**
			 * Aplica a validação aos formulários ao evento submit
			 * @return {void}
			 */
			bind : function () {
				jQ(global.document).on('submit', '.validate', function () {
					return zValidate.validate.call(zValidate, this);
				});
			}
		};

	// Create scope
	global.zValidate = {};

	/**
	 * Adiciona/Altera uma regra de validação
	 * @param  {String}   name     Nome da regra
	 * @param  {Function} callback Implementação da regra
	 * @return {void}
	 */
	global.zValidate.extensions = function (name, callback) {
		if (typeof callback === 'function') {
			rules[name] = callback;
		}
	};

	// Init plugin
	zValidate.bind();
}(this));