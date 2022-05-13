function prepareModal(content, keyboard, backdrop, show)
{
    killModal();

    var html = '<div id="modal" class="modal fade" role="dialog"></div>';

    $('body').append($(html).append(content));

    return $('#modal').modal({
        keyboard: keyboard ? keyboard : true,
        show: show ? show : true,
        backdrop: backdrop ? backdrop : true
    }).on('hidden.bs.modal', killModal);
}

function renderModal(content, callback)
{
    if ($('#modal').length == 0)
    {
        prepareModal(content);
    }

    var modal = $('#modal');

    modal.html(content);

    $('.btn').button();

    if(typeof(callback) != 'undefined')
    {
        callback.apply();
    }

    return $('#modal');
}

function isModalOpen()
{
    return $('body').hasClass('modal-open');
}

function closeModal() {
    $('#modal').modal('hide');
}

function killModal()
{
    $('#modal').modal('hide');
    $('#modal, .modal-backdrop').remove();
    $('body').removeClass('modal-open').attr("style", "");
}