zValidate v0.1
=========

Um simples validador de formulários
### Instalação

Inclua os arquivos `zvalidate.min.css` e `zvalidate.min.js` ao seu arquivo arquivo HTML
```html
<link href="zvalidate.min.css" rel="stylesheet">
<script src="zvalidate.min.js" type="text/javascript"></script>
```

###Uso

Adicione a classe `validate` aos formulários que deseja validar
```html
<form class="validate"></form>
```

Adicione os atributos `data-rule` e `data-message` ao input que receberá a validação.

O atributo `data-rule` definirá quais regras de validação deverão ser usadas.

O atributo `data-message` definirá qual mensagem deverá ser mostrado no tooltip em caso de erro.
```html
<form class="validate">
    <input type="text" id="input1" name="input1" data-rule="email" data-message="Email inválido">
</form>
```
Algumas regras podem receber um parâmetros. Esse parâmetro pode ser informado usando a seguinte sintaxe
`data-rule="date:Ydm"`. É possível também definir mais de uma regra para um input, as mesmas devem ser encadeadas usando o separador `|`.

Exemplo:
```html
data-rule="date:Ymd|required"
```


###Regras padrões
#####required
Define que o campo não pode ser deixado vazio.
```html
<input type="text" data-rule="required" data-message="Campo obrigatorio" id="exemplo1">
```

#####email
Define que o campo deve conter um endereço de email.
```html
<input type="text" data-rule="email" data-message="Email inválido" id="exemplo2">
```

#####integer
Define que o campo deve conter o número inteiro.
```html
<input type="text" data-rule="integer" data-message="Não é um número inteiro" id="exemplo3">
```

#####decimal
Define que o campo deve conter o número decimal.
```html
<input type="text" data-rule="decimal" data-message="Não é um número decimal" id="exemplo4">
```

#####minLength:999
Define que o campo deve conter um número mínimo de caracteres
```html
<input type="text" data-rule="minLength:100" data-message="Deve conter 100 caracteres" id="exemplo5">
```

#####maxLength:999
Define que o campo pode conter até um numero máximo de caracteres
```html
<input type="text" data-rule="maxLength:25" data-message="Deve conter ate 25 caracteres" id="exemplo6">
```

#####date:(Ymd|dmY)
Define que o campo deve conter uma data válida. Caso não seja informado um formato de data será usado **Ymd**
```html
<input type="text" data-rule="date:dmY" data-message="Data inválida" id="exemplo7">
```

#####ip
Define que o campo deve um endereço IP
```html
<input type="text" data-rule="ip" data-message="IP inválido" id="exemplo7">
```

#####url
Define que o campo deve conter uma URL válida
```html
<input type="text" data-rule="url" data-message="URL inválida" id="exemplo7">
```

#####equals:id
Define que o campo deve ter o valor igual a um outro campo definido
```html
<input type="text" data-rule="required" data-message="Campo obrigatório" id="password">
<input type="text" data-rule="equals:password" data-message="Os campos não conferem" id="conf_password">
```

###Criando regras personalizadas
Se as regras padrões não forem suficientes para a sua aplicação é possível criar regras de validação personalizadas. Para adicionar uma nova regra use o método `zValidate.extensions`.

```javascript
zValidate.extensions('novaRegra', function (value, arg) {
    // ...
});
```

O primeiro parâmetro da nova regra irá receber o valor do campo e o segundo parametro
define um argumento, caso faça-se necessário.

**OBS: As funções adicionadas devem ter um retorno booleano.**

###Considerações
- Todos campos devem possuir um id definido.
- A posição do tooltip é calculada automaticamente quando a validação é realizada. Caso use um layout com movimentação podem ocorrer erros visuais.

### Dependências
- jQuery 1.8.0

###Licença
MIT

(c) 2013 - Bruno Silva | eu@brunoziie.com