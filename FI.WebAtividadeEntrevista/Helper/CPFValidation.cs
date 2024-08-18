using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FI.WebAtividadeEntrevista.Helper
{
    public class CPFValidation
    {
        public bool ValidarCPF(string cpf)
        {
            cpf = new string(cpf.Where(char.IsDigit).ToArray());
            if (cpf.Length != 11)

                return false;
            if (cpf.All(c => c == cpf[0]))

                return false;
            int soma = 0;
            int peso = 10;
            for (int i = 0; i < 9; i++)
            {
                soma += int.Parse(cpf[i].ToString()) * peso--;
            }
            int digito1 = 11 - (soma % 11);
            digito1 = (digito1 >= 10) ? 0 : digito1;
            if (digito1 != int.Parse(cpf[9].ToString()))

                return false;
            soma = 0;
            peso = 11;
            for (int i = 0; i < 10; i++)
            {
                soma += int.Parse(cpf[i].ToString()) * peso--;
            }
            int digito2 = 11 - (soma % 11);
            digito2 = (digito2 >= 10) ? 0 : digito2;

            return digito2 == int.Parse(cpf[10].ToString());
        }
    }
}