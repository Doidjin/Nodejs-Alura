module.exports = function(app) {

    var listaProdutos = function(req, res) {
        var connection = app.infra.connectionFactory();
        var produtosDAO = new app.infra.ProdutosDAO(connection);

        produtosDAO.lista(function(err, results) {
            res.format({
                html: function(){
                    res.render('produtos/lista', {lista: results});
                },
                json: function(){
                    res.json(results);
                }
            });
            
        });

        connection.end();
    }

    app.get('/produtos', listaProdutos);

    app.get('/produtos/form', function(req, res) {
        res.render('produtos/form');
    });

    app.post('/produtos', function(req, res) {
        var produto = req.body;

        var validadorTitulo = req.assert('titulo', 'Titulo Obrigatório');
        validadorTitulo.notEmpty();

        var errors = req.validationErrors();
        
        if(errors){
            console.log(errors);
            return;
        } 

        var connection = app.infra.connectionFactory();
        var produtosDAO = new app.infra.ProdutosDAO(connection);

        produtosDAO.salva(produto, function(err, results) {
            if(err){
                console.log(err);
            }
            res.redirect('/produtos');
        });

        connection.end();
    });
}
