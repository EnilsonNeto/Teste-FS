CREATE OR ALTER PROCEDURE FI_SP_VerificaBeneficiario
    @CPF VARCHAR(11),
    @Id BIGINT = NULL
AS
BEGIN
    SELECT 
        Id,
        Nome,
        CPF
    FROM 
        Beneficiarios
    WHERE 
        CPF = @CPF
        AND (@Id IS NULL OR Id != @Id); 
END