﻿
$(document).ready(function () {
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
    $('#formCadastro').submit(function (e) {
        e.preventDefault();
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
                "CPF": $(this).find("#CPF").val(),
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
            }
        });
    })
    
})

var beneficiarios = [];
var IdrBeneficiarios = 1;
var beneficiarioEditandoId = null;

function salvarBeneficiario() {
    var cpf = $('#cpfBeneficiario').val();
    var nome = $('#nomeBeneficiario').val();

    if (beneficiarioEditandoId) {
        var beneficiarioExistente = beneficiarios.find(b => b.id === beneficiarioEditandoId);
        if (beneficiarioExistente) {
            beneficiarioExistente.cpf = cpf;
            beneficiarioExistente.nome = nome;
        }
        $('#' + beneficiarioEditandoId).find('.cpf').text(cpf);
        $('#' + beneficiarioEditandoId).find('.nome').text(nome);
        beneficiarioEditandoId = null;
    } else {
        var itemId = IdrBeneficiarios;
        IdrBeneficiarios++;

        var beneficiario = {
            id: itemId,
            cpf: cpf,
            nome: nome
        };
        beneficiarios.push(beneficiario);

        var itemLista = $('<div class="d-flex justify-content-between align-items-center p-2 border-bottom text-center" id="' + itemId + '"></div>');
        itemLista.append($('<span class="col-md-4 cpf">' + cpf + '</span>'));
        itemLista.append($('<span class="col-md-4 nome">' + nome + '</span>'));
        itemLista.append($('<div class="d-flex col-md-4 align-items-center justify-content-center text-center"><button class="btn btn-primary btn-sm me-3" onclick="alterarBeneficiario(\'' + itemId + '\')">Alterar</button><button class="btn btn-primary btn-sm ms-2" onclick="excluirBeneficiario(\'' + itemId + '\')">Excluir</button></div>'));

        $('#listaBeneficiarios').append(itemLista);
    }
    $('#cpfBeneficiario').val('');
    $('#nomeBeneficiario').val('');
}

function alterarBeneficiario(itemId) {
    beneficiarioEditandoId = itemId;
    var cpf = $('#' + itemId).find('.cpf').text();
    var nome = $('#' + itemId).find('.nome').text();

    $('#cpfBeneficiario').val(cpf);
    $('#nomeBeneficiario').val(nome);
    $('#modalCadastroBeneficiario').modal('show');
}

function excluirBeneficiario(itemId) {
    $('#' + itemId).remove();
    beneficiarios = beneficiarios.filter(b => b.id !== itemId);
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

$('#modalCadastroBeneficiario').on('hidden.bs.modal', function () {
    console.log(beneficiarios);
});

