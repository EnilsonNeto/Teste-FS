var beneficiariosArray = [];
$(document).ready(function () {
    var beneficiarioAtual = null;
    buscarBeneficiarios();

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

    window.removerBeneficiario = function (id) {
        if (confirm('Tem certeza de que deseja remover este beneficiário?')) {
            $.ajax({
                url: '/Beneficiario/Excluir',
                type: 'POST',
                data: { id: id },
                success: function (response) {
                    ModalDialog('Sucesso!', 'Beneficiário removido com sucesso.');
                    buscarBeneficiarios();
                },
                error: function (xhr) {
                    alert('Erro: ' + xhr.responseText);
                }
            });
        }
    };

    window.alterarBeneficiarioCadastrado = function (id) {
        beneficiarioAtual = beneficiariosArray.find(b => b.Id === id);

        if (beneficiarioAtual) {
            $('#nomeBeneficiario').val(beneficiarioAtual.Nome);
            $('#cpfBeneficiario').val(beneficiarioAtual.CPF);
        }
    };

    $('#incluirButton').click(function (e) {
        e.preventDefault();

        var dadosBeneficiario = {
            Nome: $('#nomeBeneficiario').val(),
            CPF: $('#cpfBeneficiario').val(),
            IdCliente: obj.Id
        };

        if (beneficiarioAtual) {
            dadosBeneficiario.Id = beneficiarioAtual.Id;

            $.ajax({
                url: '/Beneficiario/Alterar',
                type: 'POST',
                data: dadosBeneficiario,
                success: function (response) {
                    ModalDialog('Sucesso!', 'O beneficiario foi alterado.');
                    $("#formCadastroBeneficiario")[0].reset(); 
                    buscarBeneficiarios();
                },
                error: function (xhr) {
                    alert('Erro: ' + xhr.responseText);
                }
            });
        } else {
            $.ajax({
                url: '/Beneficiario/Incluir',
                type: 'POST',
                data: dadosBeneficiario,
                success: function (response) {
                    ModalDialog('Sucesso!', 'O beneficiário foi adicionado.');
                    buscarBeneficiarios();
                },
                error: function (xhr) {
                    alert('Erro: ' + xhr.responseText);
                }
            });
        }
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
                "CPF": cpfSemPontuacao
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

function buscarBeneficiarios() {
    $.ajax({
        url: '/Cliente/ListarBeneficiarios',
        type: 'GET',
        data: { idCliente: obj.Id },
        success: function (response) {
            if (response.success) {
                beneficiariosArray = response.data;
                atualizarListaBeneficiarios(response.data);
            } else {
                alert('Erro: ' + response.message);
            }
        },
        error: function () {
            alert('Erro ao tentar buscar os beneficiários.');
        }
    });
}

function formatarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length === 11) {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return cpf;
}

function atualizarListaBeneficiarios(beneficiarios) {
    var listaHtml = '';
    if (beneficiarios.length > 0) {
        beneficiarios.forEach(function (beneficiario) {
            var cpfFormatado = formatarCPF(beneficiario.CPF);
            listaHtml += '<div class="row border-bottom border-secondary p-2">' +
                '<div class="col-md-4 text-start">' +
                '<div class="form-group">' +
                '<span>' + cpfFormatado + '</span>' +
                '</div>' +
                '</div>' +
                '<div class="col-md-4 text-start">' +
                '<div class="form-group">' +
                '<span>' + beneficiario.Nome + '</span>' +
                '</div>' +
                '</div>' +
                '<div class="col-md-4 text-start d-flex justify-content-end">' +
                '<button type="button" class="btn btn-primary btn-sm me-3" style="margin-right: 8px;" onclick="alterarBeneficiarioCadastrado(' + beneficiario.Id + ')">Alterar</button>' +
                '<button type="button" class="btn btn-primary btn-sm ms-3" onclick="removerBeneficiario(' + beneficiario.Id + ')">Remover</button>' +
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
