// Modules (Composite-JavaScript) use their own scope. Variables and constants
// created and used here are not accessible outside and must be exported for use
// in the global scope, for which the macro #export is used.
//
// The model contact is used reactively. Thus, elements consuming in the view
// are automatically updated with changes to the values of the contact model and
// the deliberate call from the renderer, e.g. with the attribute render is not
// necessary.
const contact = ({

    name: null,
    email: null,
    subject: null,
    comment: null,

    locationLink: {
        onClick(event) {
            alert("click event on ${event.target.id}");
            return false;
        }
    },
    phoneLink: {
        onClick() {
            alert("click event on ${event.target.id}");
            return false;
        }
    },
    mailLink: {
        onClick() {
            alert("click event on ${event.target.id}");
            return false;
        }
    }
}).reactive();

#export contact;