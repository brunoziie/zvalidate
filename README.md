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


Adicione a classe `validate` aos formulários que deseja validar
```html
<form class="validate"></form>
```

Adicione os atributos `data-rule` e `data-message` ao input que receberá a validação.<br>
O atributo `data-rule` definirá quais regras de validação deverão ser usadas.<br>
O atributo `data-message` definirá qual mensagem deverá ser mostrado no tooltip em caso de erro.
```html
<form class="validate">
    <input type="text" id="input1" name="input1" data-rule="email" data-message="Email inválido">
</form>
```
Algumas regras podem receber um parâmetros. Esse parâmetro pode ser informado usando a seguinte sintaxe
`data-rule="date:Ydm"`. É possível também definir mais de uma regra para um input, as mesmas devem ser encadeadas usando o separador `|`.

**Ex:**
```html
data-rule="date:Ymd|required"
```


----------

###Regras padrões
**required**<br>
Define que o campo não pode ser deixado vazio.
```html
<input type="text" data-rule="required" data-message="Campo obrigatorio" id="exemplo1">
```

**email**<br>
Define que o campo deve conter um endereço de email.
```html
<input type="text" data-rule="email" data-message="Email inválido" id="exemplo2">
```

**integer**<br>
Define que o campo deve conter o número inteiro.
```html
<input type="text" data-rule="integer" data-message="Não é um número inteiro" id="exemplo3">
```

**decimal**<br>
Define que o campo deve conter o número decimal.
```html
<input type="text" data-rule="decimal" data-message="Não é um número decimal" id="exemplo4">
```

**minLength: 999**<br>
Define que o campo deve conter um número mínimo de caracteres
```html
<input type="text" data-rule="minLength:100" data-message="Deve conter 100 caracteres" id="exemplo5">
```

**maxLength: 999**<br>
Define que o campo pode conter até um numero máximo de caracteres
```html
<input type="text" data-rule="maxLength:25" data-message="Deve conter ate 25 caracteres" id="exemplo6">
```

**date: (Ymd|dmY)**<br>
Define que o campo deve conter uma data válida. Caso não seja informado um formato de data será usado **Ymd**
```html
<input type="text" data-rule="date:dmY" data-message="Data inválida" id="exemplo7">
```

**ip**<br>
Define que o campo deve um endereço IP
```html
<input type="text" data-rule="ip" data-message="IP inválido" id="exemplo7">
```

**url**<br>
Define que o campo deve conter uma URL válida
```html
<input type="text" data-rule="url" data-message="URL inválida" id="exemplo7">
```

**equals: id**<br>
Define que o campo deve ter o valor igual a um outro campo definido
```html
<input type="text" data-rule="required" data-message="Campo obrigatório" id="password">
<input type="text" data-rule="equals:password" data-message="Os campos não conferem" id="conf_password">
```

**checked**<br>
Define que campo do tipo radio ou checkbox deve ser marcado
```html
<input type="radio" name="myRadioInput" value="25" data-rule="radio:myRadioInput" data-message="Selecione uma opçao">
<input type="radio" name="myRadioInput" value="50" />
<input type="radio" name="myRadioInput" value="100" />
```

**diff: arg**<br>
Define que campo deve conter um valor diferente do argumento (Indicado para selects)
```html
<select name="exemplo9" id="exemplo9" data-rule="diff:0" data-message="Value deve ser diferente de 0">
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


### Definindo um callback para a validação
Você pode definir uma função de callback para um formulário caso deseje realizar alguma operação que
dependa do resultado da validação.

**zValidate.afterValidate ( formId, callback )**

| Tipo            | Parâmetro           | Descrição                               |
| --------------- |---------------------| --------------------------------------- |
| _String_        | **formId**          | ID do formulário                        |
| _Function_      | **callback(** ***result***, ***event***, ***form*** **)** | Funçao de callback   |
| _Boolean_       | **callback.result** | Resultado da validação                  |
| _Object_        | **callback.event**  | Evento de submit do formulário          |
| _Object_        | **callback.form**   | Elemento do formulário que foi validado |

**Ex:**
```javascript
zValidate.afterValidate('#myForm', function (result, event, form) {
    if(result === true){
        alert('Tudo ok! :)');
    } else {
        alert('Algo errado não está certo! :(');
    }

    event.preventDefault();
    return false;
});
```

**OBS: Caso não seja definido um callback, o comportamento padrão do formulário será executado**

----------
### Tooltips personalizados 
É possivel criar um tooltip personalizado para um campo usando uma função de callback.
Isso pode ser util para verificações externas (Login em sistema, Verificação de dispinibilidade de emails e etc),  

**this.tooltip ( inputId, text )**

| Tipo            | Parâmetro           | Descrição                |
| --------------- |---------------------| ------------------------ |
| _String_        | **inputId**         | ID do campo              |
| _String_        | **text**            | Texto do tooltip         |


**Ex:**
```javascript
zValidate.setCallback('#myForm', function (result) {
    this.tooltip('#email', 'Email indisponível');
});
```

----------

### Considerações
- Todos campos devem possuir um id definido.
- A posição do tooltip é calculada automaticamente quando a validação é realizada. Caso use um layout com movimentação podem ocorrer erros visuais.

----------

### Dependências
- jQuery >= 1.8.0

----------

### Todo
- Melhorar sistema de tooltips
- Aplicar i18n
- Criar o callback onError 

----------

###Licença
MIT

(c) 2013 - Bruno Silva | eu@brunoziie.com