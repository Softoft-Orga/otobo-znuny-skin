// Ticket Zoom. Ticket actions (Priority, Note, Close, …) open as a dialog
// on this page. OTOBO otherwise calls window.open for PopupType_TicketAction.
//
// The iframe keeps the name OTOBOPopup_TicketAction_* and WindowMode "Iframe",
// so Cancel, Submit, and Core.UI.Popup.ClosePopup still close it.

"use strict";

(function () {
    function removeTicketActionDialog() {
        var Dialog = document.getElementById("LabTicketActionDialog");
        var Shade = document.getElementById("LabTicketActionShade");
        if (!document.querySelector("iframe.PopupIframe")) {
            if (Dialog) {
                Dialog.remove();
            }
            if (Shade) {
                Shade.remove();
            }
            document.documentElement.classList.remove("NoScroll");
        }
    }

    function openTicketActionDialog(URL) {
        var Previous = document.querySelector("iframe.PopupIframe");
        if (Previous) {
            Previous.remove();
        }
        removeTicketActionDialog();

        Core.UI.Popup.SetWindowMode("Iframe");
        document.documentElement.classList.add("NoScroll");
        window.scrollTo(0, 0);

        var Type = "TicketAction";
        var Name = "OTOBOPopup_" + Type + "_" + Date.now();

        var Shade = document.createElement("div");
        Shade.id = "LabTicketActionShade";
        Shade.addEventListener("click", function () {
            var Frame = document.querySelector("#LabTicketActionDialog iframe.PopupIframe");
            if (Frame) {
                Frame.remove();
            }
            removeTicketActionDialog();
        });

        var Dialog = document.createElement("div");
        Dialog.id = "LabTicketActionDialog";

        var Frame = document.createElement("iframe");
        Frame.className = "PopupIframe";
        Frame.setAttribute("data-popuptype", Type);
        Frame.name = Name;
        Frame.title = "Ticket action";
        Frame.src = URL;

        Dialog.appendChild(Frame);
        document.body.appendChild(Shade);
        document.body.appendChild(Dialog);
    }

    document.addEventListener("click", function (Event) {
        var Target = Event.target;
        if (!(Target instanceof Element)) {
            return;
        }
        var Link = Target.closest("a.PopupType_TicketAction");
        if (!Link) {
            return;
        }
        Event.preventDefault();
        Event.stopPropagation();
        openTicketActionDialog(Link.getAttribute("href"));
    }, true);

    document.addEventListener("keydown", function (Event) {
        if (Event.key !== "Escape") {
            return;
        }
        if (!document.getElementById("LabTicketActionDialog")) {
            return;
        }
        var Frame = document.querySelector("#LabTicketActionDialog iframe.PopupIframe");
        if (Frame) {
            Frame.remove();
        }
        removeTicketActionDialog();
    });

    var ClosePopup = Core.UI.Popup.ClosePopup;
    Core.UI.Popup.ClosePopup = function () {
        if (document.getElementById("LabTicketActionDialog")) {
            Core.UI.Popup.SetWindowMode("Iframe");
        }
        var Result = ClosePopup.apply(this, arguments);
        removeTicketActionDialog();
        return Result;
    };
}());
