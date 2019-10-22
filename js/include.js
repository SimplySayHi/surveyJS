
function isPlainObject( object ){
    return Object.prototype.toString.call( object ) === '[object Object]';
}

function scrollToElement( element ){
    setTimeout(function(){
        element.scrollIntoView({ behavior: 'smooth'});
    }, 50);
}

var isLocalEnv = location.protocol.indexOf('http') === -1 || location.host.indexOf('127.0.0.1') > -1;

document.addEventListener('click', function(e){
    var key = e.which || e.keyCode;

    if( key === 1 ){
        var elem = e.target,
            cardHeaderSelector = '.panel-collapsible .card-header',
            dropDownSelector = '[data-toggle="dropdown"]',
            checkElement = function( cssSelector ){
                return (elem.matches(cssSelector) ? elem : (elem.closest(cssSelector) || null));
            };

        // CLOSE ALL OPEN DROPDOWNS
        if(
            !checkElement(dropDownSelector) ||
            elem.matches(dropDownSelector+'[aria-expanded="false"]') ||
            elem.matches(dropDownSelector+':not([aria-expanded])')
        ){
            var dropdownsOpen = document.querySelectorAll(dropDownSelector);
            if( dropdownsOpen.length > 0 ){
                Array.from(dropdownsOpen).forEach(function(dropdownEl){
                    dropdownEl.setAttribute('aria-expanded', false);
                    dropdownEl.nextElementSibling.classList.remove('show');
                });
            }
        }
        
        if( checkElement(cardHeaderSelector) ){
            
            // OPEN PANEL
            e.preventDefault();

            var cardHeader = checkElement(cardHeaderSelector),
                panelEl = elem.closest('.panel').querySelector('.card-body'),
                panelDisplay = panelEl.style.display;
            
            cardHeader.classList.toggle('active');
            panelEl.style.display = (panelDisplay === '' || panelDisplay === 'none' ? 'block' : 'none');

        } else if( checkElement(dropDownSelector) ){

            // OPEN DROPDOWN
            e.preventDefault();

            var dropDown = checkElement(dropDownSelector),
                dropDownList = dropDown.nextElementSibling,
                dropDownAriaExpanded = dropDown.getAttribute('aria-expanded'),
                ariaExpValue = ( !dropDownAriaExpanded || dropDownAriaExpanded === 'false' ? 'true' : 'false' );

            dropDown.setAttribute('aria-expanded', ariaExpValue);
            dropDownList.classList.toggle('show');

        }
    }
}, false);

document.addEventListener('DOMContentLoaded', function(){
    var version = Survey.prototype.version;
    Array.from( document.querySelectorAll('[data-print-current-version]') ).forEach(function( elem ){
        elem.innerHTML = version;
    });
});
