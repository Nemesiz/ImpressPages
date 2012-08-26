/**
 * @package ImpressPages
 * @copyright Copyright (C) 2011 ImpressPages LTD.
 * @license see ip_license.html
 */



(function($) {

    var methods = {
        init : function(options) {
            return this.each(function() {
                var $this = $(this);
                var data = $this.data('ipInlineManagementText');
                // If the plugin hasn't been initialized yet
                if ( ! data ) {
                    $this.data('ipInlineManagementText', {
                        key: $this.data('key'),
                        cssClass: $this.data('cssclass'),
                        htmlTag: $this.data('htmltag')
                    });
                    $this.closest('.ipmEdit').bind('click', $.proxy(methods.openPopup, $this));
                }
            });
        },
        

        openPopup : function () {
            $this = this;
            $this.find('.ipModuleInlineManagementPopupText').remove();

            $this.append('<div class="ipModuleInlineManagementPopupText" ></div>');


            var $popup = $this.find('.ipModuleInlineManagementPopupText');
            $popup.dialog({width: 800, height : 450, modal: true});

            $.proxy(methods.refresh, $this)();
        },

        refresh : function () {
            var $this = this;
            var data = Object();
            data.g = 'developer';
            data.m = 'inline_management';
            data.a = 'getManagementPopupString';

            data.key = $this.data('ipInlineManagementText').key;

            var urlParts = window.location.href.split('#');
            var postUrl = urlParts[0];

            $.ajax({
                type : 'POST',
                url : postUrl,
                data : data,
                context : $this,
                success : methods._refreshResponse,
                dataType : 'json'
            });
        },

        _refreshResponse : function (response) {
            var $this = this;
            if (response.status == 'success') {

                $('.ipModuleInlineManagementPopupText').html(response.html);
                $('.ipModuleInlineManagementPopupText').tabs('destroy');
                $('.ipModuleInlineManagementPopupText').tabs();

                $('.ipModuleInlineManagementPopupText').find('textarea').tinymce(ipTinyMceConfigMed);
            }

            $('.ipModuleInlineManagementPopupText').find('.ipaConfirm').bind('click', jQuery.proxy(methods._confirm, $this));
            $('.ipModuleInlineManagementPopupText').find('.ipaCancel').bind('click', jQuery.proxy(methods._cancel, $this));
        },


        _confirm : function (event) {
            event.preventDefault();
            var $this = $(this);
            $this.trigger('ipInlineManagement.logoConfirm');
            var data = Object();
            data.g = 'developer';
            data.m = 'inline_management';
            data.a = 'saveText';

            data.cssClass = $this.data('ipInlineManagementText').cssClass;
            data.key = $this.data('ipInlineManagementText').key;
            data.htmlTag = $this.data('ipInlineManagementText').htmlTag;

            $('.ipModuleInlineManagementPopupText').find('textarea').each(
                function () {
                    if (data['values'] == undefined) {
                        data['values'] = {};
                    }
                    data['values'][$(this).data('languageid')] = $(this).val();
                }
            );

            var urlParts = window.location.href.split('#');
            var postUrl = urlParts[0];


            //SAVE
            $.ajax({
                type : 'POST',
                url : postUrl,
                data : data,
                context : $this,
                success : methods._confirmResponse,
                dataType : 'json'
            });
        },

        _confirmResponse : function (answer) {
            $this = this;

            if (answer && answer.status == 'success') {
                if (answer.stringHtml) {
                    $this.closest('.ipmEdit').replaceWith(answer.stringHtml);
                }
                $this.trigger('ipInlineManagement.stringConfirm');
                $('.ipModuleInlineManagementPopupText').dialog('close');
            }
        },

        _cancel : function (event) {
            event.preventDefault();
            var $this = this;
            $('.ipModuleInlineManagement').replaceWith($this.data('ipInlineManagementText').originalLogoHtml);
            $this.trigger('ipInlineManagement.logoCancel');
            $('.ipModuleInlineManagement').ipModuleInlineManagement();
            $('.ipModuleInlineManagementPopupText').dialog('close');
        }
        
        

        
    };
    
    

    $.fn.ipModuleInlineManagementText = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.ipInlineManagementText');
        }
    };
    
    

})(jQuery);