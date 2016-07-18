define(
    [
        'emberjs'
    ],
    function (Ember) {

        var t = 1;

        return Ember.Object.extend({
            handle: function (listeningEditor, newValue, property, listenerName) {

                var contactSection;

                if (listeningEditor && listeningEditor.state === 'inDOM') {

                    switch (property) {

                        case 'contact':
                            contactSection = $("#" + $(listeningEditor.inspector.registeredEditors.lastname).attr('elementId')).parent().parent().parent();
                            if (newValue) {
                                contactSection.hide();
                            }
                            break;
                    }


                }

            }
        });
    });