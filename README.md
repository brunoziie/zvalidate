zValidate v0.2
=========

Um simples validador de formulários
### Instalação

Inclua os arquivos `zvalidate.min.css` e `zvalidate.min.js` ao seu arquivo arquivo HTML
```html
<link href="zvalidate.min.css" rel="stylesheet">
<script src="zvalidate.min.js" type="text/javascript"></script>
```

----------

### Uso


Adicione o atributo `z-validate` aos formulários que deseja validar
```html
<form z-validate></form>
```

Adicione os atributos `zv-rule` e `zv-error` ou `zv-error-[rule]` ao input que receberá a validação.<br>
O atributo `zv-rule` definirá quais regras de validação deverão ser usadas.<br>
O atributo `zv-error` ou `zv-error-[rule]` definirá qual mensagem deverá ser mostrado no tooltip em caso de erro.
```html
<form z-validate>
    <input type="text" id="input1" name="input1" zv-rule="email" data-message="Email inválido">
</form>
```
Algumas regras podem receber um parâmetros. Esse parâmetro pode ser informado usando a seguinte sintaxe
`zv-rule="date:Ydm"`. É possível também definir mais de uma regra para um input, as mesmas devem ser encadeadas usando o separador `|`.

**Ex:**
```html
zv-rule="date:Ymd|required"
```


----------

###Regras padrões
**required**<br>
Define que o campo não pode ser deixado vazio.
```html
<input type="text" zv-rule="required" data-message="Campo obrigatorio" id="exemplo1">
```

**email**<br>
Define que o campo deve conter um endereço de email.
```html
<input type="text" zv-rule="email" data-message="Email inválido" id="exemplo2">
```

**integer**<br>
Define que o campo deve conter o número inteiro.
```html
<input type="text" zv-rule="integer" data-message="Não é um número inteiro" id="exemplo3">
```

**decimal**<br>
Define que o campo deve conter o número decimal.
```html
<input type="text" zv-rule="decimal" data-message="Não é um número decimal" id="exemplo4">
```

**minLength: 999**<br>
Define que o campo deve conter um número mínimo de caracteres
```html
<input type="text" zv-rule="minLength:100" data-message="Deve conter 100 caracteres" id="exemplo5">
```

**maxLength: 999**<br>
Define que o campo pode conter até um numero máximo de caracteres
```html
<input type="text" zv-rule="maxLength:25" data-message="Deve conter ate 25 caracteres" id="exemplo6">
```

**date: (Ymd|dmY)**<br>
Define que o campo deve conter uma data válida. Caso não seja informado um formato de data será usado **Ymd**
```html
<input type="text" zv-rule="date:dmY" data-message="Data inválida" id="exemplo7">
```

**ip**<br>
Define que o campo deve um endereço IP
```html
<input type="text" zv-rule="ip" data-message="IP inválido" id="exemplo7">
```

**url**<br>
Define que o campo deve conter uma URL válida
```html
<input type="text" zv-rule="url" data-message="URL inválida" id="exemplo7">
```

**equals: id**<br>
Define que o campo deve ter o valor igual a um outro campo definido
```html
<input type="text" zv-rule="required" data-message="Campo obrigatório" id="password">
<input type="text" zv-rule="equals:password" data-message="Os campos não conferem" id="conf_password">
```

**checked**<br>
Define que campo do tipo radio ou checkbox deve ser marcado
```html
<input type="radio" name="myRadioInput" value="25" zv-rule="radio:myRadioInput" data-message="Selecione uma opçao">
<input type="radio" name="myRadioInput" value="50" />
<input type="radio" name="myRadioInput" value="100" />
```

**diff: arg**<br>
Define que campo deve conter um valor diferente do argumento (Indicado para selects)
```html
<select name="exemplo9" id="exemplo9" zv-rule="diff:0" data-message="Value deve ser diferente de 0">
    <option value="0">Selecione algo</option>
    <option value="1">Opçao 1</option>
    <option value="2">Opçao 2</option>
    <option value="3">Opçao 3</option>
    <option value="4">Opçao 4</option>
    <option value="5">Opçao 5</option>
</select>
```


----------


###Criando regras personalizadas
Se as regras padrões não forem suficientes para a sua aplicação é possível criar regras de validação personalizadas. Para adicionar uma nova regra use o método `zValidate.rule`.

**zValidate.extensions ( name, extension )**

| Tipo            | Parâmetro             | Descrição                           |
| --------------- |-----------------------| ----------------------------------- |
| _String_        | **name**              | Nome para a nova regra              |
| _Function_      | **rule(arg)**         | Implementação da regra de validação |
| _String_        | **rule.arg**          | Argumento opcional para a regra     |

**Ex:**
```javascript
zValidate.rule('novaRegra', function (arg) {
    // ...
});
```

**OBS: As funções adicionadas devem ter um retorno booleano.**

----------

### Dependências
- jQuery >= 1.8.0


----------

###Licença
MIT

(c) 2013 - Bruno Silva | eu@brunoziie.com