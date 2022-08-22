$(() => {
    $(".advanced-option").on('click', () => {
        if ($(".advanced-option").html().indexOf('<i class="fa-solid fa-angle-right"></i>Advanced') >= 0) {
            $(".advanced-option").html('<i class="fa-solid fa-angle-down"></i>Advanced');
        } else {
            $(".advanced-option").html('<i class="fa-solid fa-angle-right"></i>Advanced');
        }
    });

    $("#disable_exteriror_extensions").on("click", () => toggleExteriorExtensionCheckbox());
    $("#disable_interior_extensions").on("click", () => toggleInteriorExtensionCheckbox());

    function toggleExteriorExtensionCheckbox() {
        if ($("#disable_exteriror_extensions").is(":checked")) {
            $("#generator_exterior_extensions").prop("disabled", true);
            $("#generator_exterior_extensions").val(0);
            $("#generator_exterior_bond_type_zipbond").prop("disabled", true);
            $("#generator_exterior_bond_type_zipbond").prop("checked", false);
            $("#generator_exterior_bond_type_armbond").prop("disabled", true);
            $("#generator_exterior_bond_type_armbond").prop("checked", false);
            $("#exterior_extension_sequence_upload").prop("disabled", true);
        } else {
            $("#generator_exterior_extensions").prop("disabled", false);
            $("#generator_exterior_extensions").val(10);
            $("#generator_exterior_bond_type_zipbond").prop("disabled", false);
            $("#generator_exterior_bond_type_zipbond").prop("checked", true);
            $("#generator_exterior_bond_type_armbond").prop("disabled", false);
            $("#exterior_extension_sequence_upload").prop("disabled", false);
        }
    };

    function toggleInteriorExtensionCheckbox() {
        if ($("#disable_interior_extensions").is(":checked")) {
            $("#generator_interior_extensions").prop("disabled", true);
            $("#generator_interior_extensions").val(0);
            $("#generator_interior_bond_type_zipbond").prop("disabled", true);
            $("#generator_interior_bond_type_zipbond").prop("checked", false);
            $("#generator_interior_bond_type_armbond").prop("disabled", true);
            $("#generator_interior_bond_type_armbond").prop("checked", false);
            $("#interior_extension_sequence_upload").prop("disabled", true);
        } else {
            $("#generator_interior_extensions").prop("disabled", false);
            $("#generator_interior_extensions").val(10);
            $("#generator_interior_bond_type_zipbond").prop("disabled", false);
            $("#generator_interior_bond_type_zipbond").prop("checked", true);
            $("#generator_interior_bond_type_armbond").prop("disabled", false);
            $("#interior_extension_sequence_upload").prop("disabled", false);
        }
    };
});