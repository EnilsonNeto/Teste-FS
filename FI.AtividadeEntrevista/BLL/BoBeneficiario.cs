﻿using System.Collections.Generic;

namespace FI.AtividadeEntrevista.BLL
{
    public class BoBeneficiario
    {
        /// <summary>
        /// Inclui um novo Beneficiario
        /// </summary>
        /// <param name="beneficiario">Objeto de beneficiario</param>
        public long Incluir(DML.Beneficiario beneficiario)
        {
            DAL.DaoBeneficiario daoBeneficiario = new DAL.DaoBeneficiario();
            return daoBeneficiario.Incluir(beneficiario);
        }

        /// <summary>
        /// Altera um beneficiario
        /// </summary>
        /// <param name="beneficiario">Objeto de beneficiario</param>
        public void Alterar(DML.Beneficiario beneficiario)
        {
            DAL.DaoBeneficiario daoBeneficiario = new DAL.DaoBeneficiario();
            daoBeneficiario.Alterar(beneficiario);
        }

        /// <summary>
        /// Excluir o beneficiario pelo id
        /// </summary>
        /// <param name="id">id do beneficiario</param>
        /// <returns></returns>
        public void Excluir(long id)
        {
            DAL.DaoBeneficiario daoBeneficiario = new DAL.DaoBeneficiario();
            daoBeneficiario.Excluir(id);
        }

        /// <summary>
        /// Lista os beneficiarios
        /// </summary>
        public List<DML.Beneficiario> Listar(long idCliente)
        {
            DAL.DaoBeneficiario daoBeneficiario = new DAL.DaoBeneficiario();
            return daoBeneficiario.Listar(idCliente);
        }

        /// <summary>
        /// Verifica se esta cadastrando com o mesmo cpf outro usuario.
        /// </summary>

        public bool VerificarExistencia(string CPF, long? id = null)
        {
            DAL.DaoBeneficiario cli = new DAL.DaoBeneficiario();
            return cli.VerificarExistencia(CPF, id);
        }

        /// <summary>
        /// Realiza um consulta na tabela de beneficiarios.
        /// </summary>

        public DML.Beneficiario Consultar(long id)
        {
            DAL.DaoBeneficiario cli = new DAL.DaoBeneficiario();
            return cli.Consultar(id);
        }
    }
}