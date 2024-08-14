CREATE OR ALTER PROCEDURE FI_SP_VerificaBeneficiario
    @CPF VARCHAR(11)
AS
BEGIN
    SELECT 
        Id,
        Nome,
        CPF
    FROM 
        Beneficiarios
    WHERE 
        CPF = @CPF;
END