class Capture {

    constructor() {
        this._snapshots = [];
        this._patterns  = [];
    }

    snap(content) {
        if (content === undefined)
            content = document.body.textContent;
        this._snapshots.push(content.simplify());
    }

    snapshots() {
        return this._snapshots;
    }

    size() {
        return this._snapshots.length;
    }

    patterns() {
        if (this._patterns.length > 0)
            return this._patterns;
        document.querySelectorAll("script[type=\"text/test\"]").forEach(script => {
            this._patterns.push(script.textContent.simplify());
        });
        return this._patterns;
    }

    validate() {
        this._snapshots.forEach((snapshot, index) => {
            console.log(`Test based on script #${index +1}`);
            try {Assert.assertEquals(this._patterns[index], snapshot);
            } catch (error) {
                this.output(index);
                throw error;
            }
        });
    }

    output(index = -1) {
        let content = "";
        let snapshots = this._snapshots;
        if (index >= 0 && index < snapshots.length)
            snapshots = snapshots.slice(index, index+1);
        snapshots.forEach((snapshot, index) => {
            content += "\n<script type=\"text/test\">";
            snapshot.split(/\s*[\r\n]+\s*/).forEach(line => {
                content += "\n  " + line;
            })
            content += "\n</script>";
        });
        console.log(content.trim());
    }

    toString() {
        return String(this._snapshots);
    }
}