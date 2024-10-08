﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FI.AtividadeEntrevista.DML;

namespace FI.AtividadeEntrevista.DAL
{
    /// <summary>
    /// Classe de acesso a dados de Beneficiario
    /// </summary>
    internal class DaoBeneficiario : AcessoDados
    {
        /// <summary>
        /// Inclui um novo beneficiario
        /// </summary>
        /// <param name="beneficiario">Objeto de beneficiario</param>
        internal long Incluir(DML.Beneficiario beneficiario)
        {
            List<System.Data.SqlClient.SqlParameter> parametros = new List<System.Data.SqlClient.SqlParameter>
            {
                new System.Data.SqlClient.SqlParameter("Nome", beneficiario.Nome),
                new System.Data.SqlClient.SqlParameter("CPF", beneficiario.CPF),
                new System.Data.SqlClient.SqlParameter("IdCliente", beneficiario.IdCliente)
            };

            DataSet dataSet = base.Consultar("FI_SP_IncBeneficiarioV2", parametros);

            long result = 0;

            if (dataSet.Tables[0].Rows.Count > 0)
                long.TryParse(dataSet.Tables[0].Rows[0][0].ToString(), out result);

            return result;
        }

        /// <summary>
        /// Lista todos os beneficiario de um cliente
        /// </summary>
        internal List<DML.Beneficiario> Listar(long idCliente)
        {
            List<System.Data.SqlClient.SqlParameter> parametros = new List<System.Data.SqlClient.SqlParameter>
            {
                new System.Data.SqlClient.SqlParameter("IdCliente", idCliente)
            };

            DataSet dataSet = base.Consultar("FI_SP_ConsBeneficiariosByClienteId", parametros);

            List<DML.Beneficiario> result = Converter(dataSet);

            return result;
        }

        /// <summary>
        /// Edita um beneficiario
        /// </summary>
        /// <param name="beneficiario">Objeto de beneficiario</param>
        internal void Alterar(DML.Beneficiario beneficiario)
        {
            List<System.Data.SqlClient.SqlParameter> parametros = new List<System.Data.SqlClient.SqlParameter>
            {
                new System.Data.SqlClient.SqlParameter("Nome", beneficiario.Nome),
                new System.Data.SqlClient.SqlParameter("CPF", beneficiario.CPF),
                new System.Data.SqlClient.SqlParameter("IdCliente", beneficiario.IdCliente),
                new System.Data.SqlClient.SqlParameter("ID", beneficiario.Id),
            };

            base.Executar("FI_SP_AltBeneficiario", parametros);
        }

        /// <summary>
        /// Excluir Beneficiario
        /// </summary>
        /// <param name="beneficiario">Objeto de beneficiario</param>
        internal void Excluir(long Id)
        {
            List<System.Data.SqlClient.SqlParameter> parametros = new List<System.Data.SqlClient.SqlParameter>
            {
                new System.Data.SqlClient.SqlParameter("Id", Id)
            };

            base.Executar("FI_SP_DelBeneficiario", parametros);
        }

        /// <summary>
        /// Lista todos os Beneficiarios
        /// </summary>

        private List<DML.Beneficiario> Converter(DataSet dataSet)
        {
            List<DML.Beneficiario> lista = new List<DML.Beneficiario>();

            if (dataSet != null && dataSet.Tables != null && dataSet.Tables.Count > 0 && dataSet.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow row in dataSet.Tables[0].Rows)
                {
                    DML.Beneficiario beneficiario = new DML.Beneficiario
                    {
                        Id = row.Field<long>("Id"),
                        Nome = row.Field<string>("Nome"),
                        CPF = row.Field<string>("CPF"),
                        IdCliente = row.Field<long>("IdCliente")
                    };

                    lista.Add(beneficiario);
                }
            }

            return lista;
        }

        /// <summary>
        /// Realiza uma consulta na tabela Beneficiarios
        /// </summary>

        internal DML.Beneficiario Consultar(long Id)
        {
            List<System.Data.SqlClient.SqlParameter> parametros = new List<System.Data.SqlClient.SqlParameter>();

            parametros.Add(new System.Data.SqlClient.SqlParameter("Id", Id));

            DataSet ds = base.Consultar("FI_SP_ConsBeneficiario", parametros);
            List<DML.Beneficiario> cli = Converter(ds);

            return cli.FirstOrDefault();
        }

        /// <summary>
        /// Verifica a existencia de um cpf em beneficiarios para validação
        /// </summary>

        internal bool VerificarExistencia(string CPF, long? id = null)
        {
            string cpfSemPontuacao = CPF.Replace(".", "").Replace("-", "");

            List<System.Data.SqlClient.SqlParameter> parametros = new List<System.Data.SqlClient.SqlParameter>
    {
        new System.Data.SqlClient.SqlParameter("CPF", cpfSemPontuacao),
        new System.Data.SqlClient.SqlParameter("Id", id.HasValue ? (object)id.Value : DBNull.Value)
    };

            DataSet ds = base.Consultar("FI_SP_VerificaBeneficiario", parametros);

            return ds.Tables[0].Rows.Count > 0;
        }
    }
}
