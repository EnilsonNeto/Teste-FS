﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebAtividadeEntrevista.Models
{
    /// <summary>
    /// Classe de Modelo de Beneficiario
    /// </summary>
    public class BeneficiarioModel
    {
        /// <summary>
        /// Id
        /// </summary>
        public long Id { get; set; }

        /// <summary>
        /// IdCliente
        /// </summary>
        public long IdCliente { get; set; }

        /// <summary>
        /// Nome
        /// </summary>
        [Required]
        public string Nome { get; set; }

        /// <summary>
        /// CPF
        /// </summary>
        [Required(ErrorMessage = "CPF é obrigatório.")]
        [StringLength(14, ErrorMessage = "O CPF deve conter 11 digitos.", MinimumLength = 11)]
        public string CPF { get; set; }
    }
}