using FI.AtividadeEntrevista.BLL;
using WebAtividadeEntrevista.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using FI.AtividadeEntrevista.DML;
using FI.WebAtividadeEntrevista.Helper;
using System.Web.UI.WebControls;

namespace WebAtividadeEntrevista.Controllers
{
    public class BeneficiarioController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }


        [HttpPost]
        public JsonResult Incluir(BeneficiarioModel model)
        {
            BoBeneficiario boBeneficiario = new BoBeneficiario();
            CPFValidation cpfValidation = new CPFValidation();
            string cpfSemPontuacao = model.CPF.Replace(".", "").Replace("-", "");

            if (boBeneficiario.VerificarExistencia(model.CPF))
            {
                Response.StatusCode = 400;
                return Json("Erro: CPF já cadastrado no sistema digite um CPF válido.");
            }

            if (!cpfValidation.ValidarCPF(model.CPF))
            {
                Response.StatusCode = 400;
                return Json("Erro: CPF inválido.");
            }

            if (!this.ModelState.IsValid)
            {
                List<string> erros = (from item in ModelState.Values
                                      from error in item.Errors
                                      select error.ErrorMessage).ToList();

                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, erros));
            }
            else
            {
                model.Id = boBeneficiario.Incluir(new Beneficiario()
                {
                    Nome = model.Nome,
                    CPF = cpfSemPontuacao,
                    IdCliente = model.IdCliente
                });

                return Json("Cadastro efetuado com sucesso");
            }
        }

        [HttpPost]
        public JsonResult Alterar(BeneficiarioModel model)
        {
            BoBeneficiario bo = new BoBeneficiario();
            CPFValidation cpfValidation = new CPFValidation();
            string cpfSemPontuacao = model.CPF.Replace(".", "").Replace("-", "");

            if (bo.VerificarExistencia(cpfSemPontuacao, model.Id))
            {
                Response.StatusCode = 400;
                return Json("Erro: CPF já cadastrado no sistema digite um CPF válido.");
            }

            if (!cpfValidation.ValidarCPF(cpfSemPontuacao))
            {
                Response.StatusCode = 400;
                return Json("Erro: CPF inválido.");
            }

            if (!this.ModelState.IsValid)
            {
                List<string> erros = (from item in ModelState.Values
                                      from error in item.Errors
                                      select error.ErrorMessage).ToList();

                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, erros));
            }
            else
            {
                bo.Alterar(new Beneficiario()
                {
                    Id = model.Id,
                    Nome = model.Nome,
                    CPF = cpfSemPontuacao,
                    IdCliente = model.IdCliente
                });

                return Json("Cadastro alterado com sucesso");
            }
        }

        [HttpGet]
        public ActionResult Alterar(long id)
        {
            BoBeneficiario bo = new BoBeneficiario();
            Beneficiario beneficiario = bo.Consultar(id);
            Models.BeneficiarioModel model = null;

            if (beneficiario != null)
            {
                model = new BeneficiarioModel()
                {
                    Id = beneficiario.Id,
                    Nome = beneficiario.Nome,
                    CPF = beneficiario.CPF,
                    IdCliente = beneficiario.IdCliente
                };

            }

            return View(model);
        }

        [HttpPost]
        public JsonResult Excluir(long id)
        {
            try
            {
                BoBeneficiario boBeneficiario = new BoBeneficiario();
                boBeneficiario.Excluir(id);

                return Json("Beneficiário excluído com sucesso");
            }
            catch (Exception ex)
            {
                Response.StatusCode = 500;
                return Json($"Erro: {ex.Message}");
            }
        }

    }
}