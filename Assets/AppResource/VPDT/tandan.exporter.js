var Tandan = Tandan || {};
Tandan.Exporter = function (site) {
    this._handler = '/_LAYOUTS/TanDan/DownloadController.ashx';
    if (site) {
        if (site.endsWith('/')) site = site.substring(0, site.length - 1);
        this._handler = site + this._handler;
    }
    this._getOrCreateFrame = function () {
        var f = document.getElementById("frm-download");
        if (!f) {
            f = document.createElement('iframe');
            f.setAttribute('id', "frm-download");
            f.setAttribute('style', 'display:none');
            f.setAttribute('src', 'javascript:false');
            f.setAttribute('target', "frm-download");
            f.setAttribute('enctype', "multipart/form-data");
            document.body.appendChild(f);
        }
        return f;
    }
    this._getOrCreateForm = function (doc) {
        var f = doc.forms['form_download'];
        if (!f) {
            doc.write('<html><body></body></html>');
            f = doc.createElement('form');
            f.setAttribute('id', 'form_download');
            f.setAttribute('name', 'form_download');
            f.setAttribute('method', 'post');
            f.setAttribute('action', this._handler);
            doc.body.appendChild(f);
        }
        return f;
    }
    this.removeNode = function (el) {
        el.parentNode.removeChild(el);
    }
    this._runCmd = function (type, cmd) {
        var frame = this._getOrCreateFrame();
        var doc = frame.contentWindow.document;
        var form = this._getOrCreateForm(doc);
        //
        var input = doc.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('id', 'type');
        input.setAttribute('name', 'type');
        input.value = type;
        form.appendChild(input);
        //
        input = doc.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('id', 'data');
        input.setAttribute('name', 'data');
        input.value = cmd;
        form.appendChild(input);
        // submit
        form.submit();
        this.removeNode(form);
        form = null;
        inpu = null;
    }
}
Tandan.Exporter.prototype = {
    download: function (assembly, type, params) {
        var cmd = "assembly=" + assembly + ",type=" + type;
        var p = '';
        if (params)
            for (var x in params) {
                if (p != '') p += '|';
                p += '' + x + ':' + encodeURIComponent('' + params[x]);
            }
        if(p!='')
        cmd += ',param='+p;
        this._runCmd('cmd', cmd);
    },
    downloadByFileId: function (id) {
        this._runCmd('file', id);
    }
}