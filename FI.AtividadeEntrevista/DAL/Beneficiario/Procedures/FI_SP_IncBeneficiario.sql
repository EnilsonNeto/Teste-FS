CREATE OR ALTER PROCEDURE FI_SP_IncBeneficiarioV2
    @Nome          VARCHAR(50),
    @CPF           VARCHAR(14),
    @IdCliente     INT
AS
BEGIN
    INSERT INTO Beneficiarios (Nome, CPF, IdCliente)
    VALUES (@Nome, @CPF, @IdCliente)

    SELECT SCOPE_IDENTITY()
END

