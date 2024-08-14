
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

    $('#cpfBeneficiario').on('input', function () {
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
                }
        });
    });

    var beneficiarios = [];
    var IdBeneficiarios = 1;
    var beneficiarioEditandoId = null;

    window.salvarBeneficiario = function () {
        var cpf = $('#cpfBeneficiario').val().replace(/\D/g, '');
        var nome = $('#nomeBeneficiario').val();

        if (!validarCPF(cpf)) {
            ModalDialog('CPF inválido.', ' Por favor, insira um CPF válido.');
            return;
        }

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
            var itemId = IdBeneficiarios;
            IdBeneficiarios++;

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

        console.log('Beneficiário adicionado:', beneficiario);
    }

    window.alterarBeneficiario = function (itemId) {
        beneficiarioEditandoId = itemId;
        var cpf = $('#' + itemId).find('.cpf').text();
        var nome = $('#' + itemId).find('.nome').text();

        $('#cpfBeneficiario').val(cpf);
        $('#nomeBeneficiario').val(nome);
        $('#modalCadastroBeneficiario').modal('show');
    }

    window.excluirBeneficiario = function (itemId) {
        $('#' + itemId).remove();
        beneficiarios = beneficiarios.filter(b => b.id !== itemId);
    }
});

function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11) return false;
    if (/^(\d)\1+$/.test(cpf)) return false;

    var soma = 0;
    var peso = 10;
    for (var i = 0; i < 9; i++) {
        soma += parseInt(cpf[i]) * peso--;
    }
    var digito1 = 11 - (soma % 11);
    digito1 = (digito1 >= 10) ? 0 : digito1;
    if (digito1 != parseInt(cpf[9])) return false;

    soma = 0;
    peso = 11;
    for (var i = 0; i < 10; i++) {
        soma += parseInt(cpf[i]) * peso--;
    }
    var digito2 = 11 - (soma % 11);
    digito2 = (digito2 >= 10) ? 0 : digito2;

    return digito2 === parseInt(cpf[10]);
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

