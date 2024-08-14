CREATE PROCEDURE FI_SP_ConsBeneficiariosByClienteId
    @IdCliente BIGINT
AS
BEGIN

    SELECT *
    FROM BENEFICIARIOS
    WHERE IdCliente = @IdCliente;
END
