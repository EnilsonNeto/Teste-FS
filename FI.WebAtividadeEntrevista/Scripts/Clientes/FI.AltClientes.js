
$(document).ready(function () {
    $.ajax({
        url: '/Cliente/ListarBeneficiarios',
        type: 'GET',
        data: { idCliente: obj.Id },
        success: function (response) {
            if (response.success) {
                // Atualiza a lista de beneficiários
                atualizarListaBeneficiarios(response.data);
            } else {
                alert('Erro: ' + response.message);
            }
        },
        error: function () {
            alert('Erro ao tentar buscar os beneficiários.');
        }
    });
    window.removerBeneficiario = function (id) {
        alert('Remover beneficiário com ID: ' + id);
    };

    $('#CPF').on('input', function () {
        var value = $(this).val();
        value = value.replace(/\D/g, '');

        if (value.length <= 11) {
            value = value.replace(/(\d{3})(\d{1,3})/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})/, '$1-$2');
        }

        $(this).val(value);
    });

    if (obj) {
        $('#formCadastro #Nome').val(obj.Nome);
        $('#formCadastro #CEP').val(obj.CEP);
        $('#formCadastro #Email').val(obj.Email);
        $('#formCadastro #Sobrenome').val(obj.Sobrenome);
        $('#formCadastro #Nacionalidade').val(obj.Nacionalidade);
        $('#formCadastro #Estado').val(obj.Estado);
        $('#formCadastro #Cidade').val(obj.Cidade);
        $('#formCadastro #Logradouro').val(obj.Logradouro);
        $('#formCadastro #Telefone').val(obj.Telefone);
        var cpf = obj.CPF.replace(/\D/g, '');
        if (cpf.length <= 11) {
            cpf = cpf.replace(/(\d{3})(\d{1,3})/, '$1.$2');
            cpf = cpf.replace(/(\d{3})(\d{1,2})/, '$1.$2');
            cpf = cpf.replace(/(\d{3})(\d{1,2})/, '$1-$2');
        }
        $('#formCadastro #CPF').val(cpf);
    }

    $('#formCadastro').submit(function (e) {
        e.preventDefault();
        var cpfSemPontuacao = $('#CPF').val().replace(/\D/g, '');
        $.ajax({
            url: urlPost,
            method: "POST",
            data: {
                "NOME": $(this).find("#Nome").val(),
                "CEP": $(this).find("#CEP").val(),
                "Email": $(this).find("#Email").val(),
                "Sobrenome": $(this).find("#Sobrenome").val(),
                "Nacionalidade": $(this).find("#Nacionalidade").val(),
                "Estado": $(this).find("#Estado").val(),
                "Cidade": $(this).find("#Cidade").val(),
                "Logradouro": $(this).find("#Logradouro").val(),
                "Telefone": $(this).find("#Telefone").val(),
                "CPF": cpfSemPontuacao,
                "Beneficiarios": beneficiarios
            },
            error:
            function (r) {
                if (r.status == 400)
                    ModalDialog("Ocorreu um erro", r.responseJSON);
                else if (r.status == 500)
                    ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
            },
            success:
            function (r) {
                ModalDialog("Sucesso!", r)
                $("#formCadastro")[0].reset();                                
                window.location.href = urlRetorno;
            }
        });
    })
    
})

function atualizarListaBeneficiarios(beneficiarios) {
    var listaHtml = '';
    if (beneficiarios.length > 0) {
        beneficiarios.forEach(function (beneficiario) {
            listaHtml += '<div class="row" style="border-bottom: 1px solid #dddddd; padding: 10px 0;">' +
                '<div class="col-md-4">' +
                '<div class="form-group">' +
                '<span>' + beneficiario.CPF + '</span>' +
                '</div>' +
                '</div>' +
                '<div class="col-md-4">' +
                '<div class="form-group">' +
                '<span>' + beneficiario.Nome + '</span>' +
                '</div>' +
                '</div>' +
                '<div class="col-md-4">' +
                '<div class="d-flex">' +  // Adicionando d-flex para alinhar os botões horizontalmente
                '<button type="button" class="btn btn-primary btn-sm me-2" onclick="alterarBeneficiario(' + beneficiario.Id + ')">Alterar</button>' +
                '<button type="button" class="btn btn-primary btn-sm" onclick="removerBeneficiario(' + beneficiario.Id + ')">Remover</button>' +
                '</div>' +
                '</div>' +
                '</div>';
        });
    } else {
        listaHtml = '<div class="row"><div class="col-md-12 text-center">Nenhum beneficiário encontrado.</div></div>';
    }
    $('#listaBeneficiarios').html(listaHtml);
}

function ModalDialog(titulo, texto) {
    var random = Math.random().toString().replace('.', '');
    var texto = '<div id="' + random + '" class="modal fade">                                                               ' +
        '        <div class="modal-dialog">                                                                                 ' +
        '            <div class="modal-content">                                                                            ' +
        '                <div class="modal-header">                                                                         ' +
        '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>         ' +
        '                    <h4 class="modal-title">' + titulo + '</h4>                                                    ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-body">                                                                           ' +
        '                    <p>' + texto + '</p>                                                                           ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-footer">                                                                         ' +
        '                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>             ' +
        '                                                                                                                   ' +
        '                </div>                                                                                             ' +
        '            </div><!-- /.modal-content -->                                                                         ' +
        '  </div><!-- /.modal-dialog -->                                                                                    ' +
        '</div> <!-- /.modal -->                                                                                        ';

    $('body').append(texto);
    $('#' + random).modal('show');
}
