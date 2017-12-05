function articleUpdate(caller){
    var frmId = caller.dataset.frm;
    var frm = document.querySelector(`#${frmId}`);
    var frmData = new FormData(frm);
    if(frmData.get('title').length < 1){
        alert('Artiklen må ikke være uden overskrift');
        return;
    }
    if(frmData.get('article').length < 1){
        alert('Artiklen må ikke være tom.');
        return;
    }
    if(frmData.get('catId') == 0){
        alert('Kategori skal være valgt');
        return;
    }
    fetch('/article', {credentials : 'include', method : 'put', body : frmData})
    .then(function(data){
        document.querySelector('div[data-cmd="edit"]').click();
    })
}

function articleDelete(caller){
    var dd;
    var ddVal = document.querySelector('#ddArtId').value;
    var form = document.querySelector(`#${caller.dataset.id}`);
    var formdata = new FormData(form);
    fetch('/article',{method : 'delete', credentials : 'include', body : formdata})
    .then(function(data){
        document.querySelector('div[data-cmd="edit"]').click();
    });
}

// Sender ny artikel til serveren
function articleAdd(caller){
    var frmId = caller.dataset.frm;
    var frm = document.querySelector(`#${frmId}`);
    var frmData = new FormData(frm);
    if(frmData.get('title').length < 1){
        alert('Du skal skrive en overskrift');
        return;
    }
    if(frmData.get('article').length < 1){
        alert('Du har glemt at skrive artiklen.');
        return;
    }
    if(frmData.get('catId') == 0){
        alert('Husk at vælge kategori');
        return;
    }
    fetch('/article',{credentials:'include', method: 'post', body: frmData})
    .then(function(data){
        document.querySelector('div[data-cmd="article"]').click();
    })
    .catch(function(err){
        console.log(err);
    })
}

function articleEdit(caller){
    article(caller.dataset.artid);
}

// Dropdownbox med artikelkategorier
function edit(id){
    fetch('/menuitems', {method: 'get'})
    .then(function(data){
        return data.json();
    })
    .then(function(jsonData){
        if(jsonData){
            var dropdown = document.createElement("select");
            dropdown.id = 'ddArtId';
            dropdown.name = "catId";
            dropdown.addEventListener('change',articleOverview, true);
            var option = document.createElement("option");
            option.value = 0;
            option.textContent = "Vælg kategori";
            dropdown.appendChild(option);
            jsonData.forEach(function(jd){
                option = document.createElement("option");
                option.value = jd.id;
                option.textContent = jd.name;
                dropdown.appendChild(option);
            });

            var container = document.createElement("div");  // Opret div-container til dropdown
            container.id = "editContainer"                  // Set id på container
            container.className = "tbl-container";          // set className på container
            container.appendChild(dropdown);
            var content = document.querySelector("#content")
            content.innerHTML = '';                         // Tøm #content
            content.appendChild(container);                 // append container til #content
            
        }
    });
}

function articleOverview(e){
    var caller = e.target;
    fetch('/article?catid='+caller.value, {method:'get'})
    .then(function(data){
        return data.json();
    })
    .then(function(jsonData){
        if(jsonData && jsonData.length > 0){
            // opret container
            var editContainer = document.querySelector("#editContainer");
            while(editContainer.childNodes.length > 1) {
                editContainer.lastChild.removeEventListener('click')
                editContainer.removeChild(editContainer.lastChild);
            }
            var hr = document.createElement('hr')
            hr.style.margin = '10px';

            editContainer.appendChild(hr);

            jsonData.forEach(function(jd){
                
                var form = document.createElement('form');   // Opret form med id
                form.id = `frm${jd.id}`;
                
                var row = document.createElement('div');    // opret row med classname
                row.className = "tbl-row";

                var cell = document.createElement('div');   // opret cell med classname
                cell.className = 'tbl-cell';

                var input = document.createElement('input');      // opret readonly-input med value
                input.readOnly = true;  
                input.value = jd.title;
                        
                cell.appendChild(input);    // append input til cell

                input = document.createElement('input');
                input.type = "hidden";
                input.value = jd.id;
                input.name = "id";
                cell.appendChild(input);    //
                row.appendChild(cell);   // append cell til row

                cell = document.createElement('div');   // opret cell til img-edit
                cell.className = "tbl-cell";
                            
                
                var img = document.createElement('img'); // opret img til 'rediger-knap'
                img.classList = "iconImage clickable";
                img.src = "img/Pencil.png";
                img.dataset.cmd = "articleEdit"
                img.dataset.artid = `${jd.id}`

                cell.appendChild(img);  // append img til cell
                row.appendChild(cell);   // append cell til row

                cell = document.createElement('div') // opret cell til img-edit
                cell.className = "tbl-cell";

                var img = document.createElement('img');    // opret img
                img.classList = "iconImage clickable";
                img.src = "img/Trash.png";
                img.dataset.cmd = "articleDelete";
                img.dataset.id = `frm${jd.id}`

                cell.appendChild(img);  // append img til cell

                row.appendChild(cell);  // append cell til row

                form.appendChild(row);   // append row til form

                // container.appendChild(form);    // append form til container
                editContainer.appendChild(form);

            });
        }
        
    })
    .catch(function(err){
        console.log(err);
    })
}

// Formular med textarea til ny artikel
function article(artId){
    artId = parseInt(artId) || null;
    fetch('/menuitems', {method : 'get'})
    .then(function(data){
        return data.json();
    })
    .then(function(jsonData){
        if(jsonData){
            var dropdown = document.createElement("select");
            dropdown.id = "dd_Art"
            dropdown.name="catId";
            var option = document.createElement("option");
            option.value = 0;
            option.textContent = "Vælg kategori";
            dropdown.appendChild(option);
            jsonData.forEach(function(jd){
                option = document.createElement("option");
                option.value = jd.id;
                option.textContent = jd.name;
                dropdown.appendChild(option);
            });
            var form = document.createElement("form")
            form.id = "frmArticle";

            var title = document.createElement("input")
            // title.width = 50;
            title.id = "headline";
            title.type = "text";
            title.name = "title";
            title.placeholder = "Artikel overskrift";
            var textarea = document.createElement("textarea")
            textarea.id = 'artText';
            textarea.name = "article";
            form.appendChild(title);
            form.appendChild(textarea);
            form.appendChild(dropdown);

            var btn = document.createElement('button');
            btn.type = "button";
            if(artId){
                var articleId = document.createElement('input');
                articleId.type = 'hidden';
                articleId.value = artId;
                articleId.name = 'artid';
                form.appendChild(articleId);
                btn.dataset.cmd = "articleUpdate"
                btn.dataset.artid = artId
                btn.innerHTML = "Update";
            }
            else{
                btn.dataset.cmd = "articleAdd";
                btn.innerHTML = "Upload";
            }
            btn.dataset.frm = "frmArticle";
            form.appendChild(btn);
            var container = document.createElement("div");
            container.className = "tbl-container";
            container.appendChild(form);
            var content = document.querySelector('#content');
            content.innerHTML = '';
            content.appendChild(container);
        }
    })
    .then(function(){
        if(artId){
            fetch(`/article?artid=${artId}`, {method : 'get'})
            .then(function(data){
                return data.json();
            })
            .then(function(jsonData){
                var dd = document.querySelector('#dd_Art');
                dd.value = jsonData[0].category_id;
                var headline = document.querySelector('#headline');
                headline.value = jsonData[0].title
                var txt = document.querySelector('#artText')
                txt.textContent = jsonData[0].content;
            })
            .catch(function(err){
                console.log(err);
            })
        }            
    })
    .catch(function(err){
        console.log(err);
    })
}

function categories() {
    fetch('/menuitems', { method: 'get' })
        .then(function (data) {
            return data.json();
        })
        .then(function (jsonData) {
            var content = `
                        <div class="tbl-container"><div class="tbl-head">Rediger menu</div>
                            <form>
                                <div class="tbl-row">
                                    <div class="tbl-cell"><input class="center" readonly type="text" value="Navn"></div>
                                    <div class="tbl-cell"><input class="center" readonly type="text" value="Position"></div>
                                </div>
                            </form>`;
            jsonData.forEach(function (d) {
                content += `<form id="frm${d.id}">
                                <div class="tbl-row">
                                    <div class="tbl-cell">
                                        <input name="id" type="hidden" value="${d.id}">
                                        <input name="catname" type="text" value="${d.name}">
                                    </div>
                                    <div class="tbl-cell">
                                        <input name="catpos" type="number" value="${d.position}">
                                    </div>
                                    <div class="tbl-cell">
                                        <img data-cmd="catEdit" data-id="frm${d.id}" class="iconImage clickable" src="img/Refresh.png" title="Opdater">
                                    </div>
                                    <div class="tbl-cell">
                                        <img data-cmd="catDelete" data-id="frm${d.id}" class="iconImage clickable" src="img/Trash.png" title="Slet">
                                    </div>
                                </div>
                            </form>`;
            });
            content += `<br><hr>Eller tilføj<form id="frmCatAdd">
                            <div class="tbl-row">
                                <div class="tbl-cell">
                                    <input name="catname" type="text" placeholder="Menunavn">
                                </div>
                                <div class="tbl-cell">
                                    <input name="catpos" type="number" placeholder="position">
                                </div>
                                <div class="tbl-cell">
                                    <img data-cmd="catAdd"  class="iconImage clickable" src="img/plus-2x.png" title="Opdater">
                                </div>
                            </div>
                        <form>`;

            // content += `<br><button type="button" data-cmd="catAdd" style="width:99%">Tilføj menupunkt</button>`
            content += `</div>`;
            document.querySelector('#content').innerHTML = content;
        })
        .catch(function (err) {
            console.log(err);
        })
}    

function catAdd(caller){
    var form = document.querySelector('#frmCatAdd');
    var formData = new FormData(form);
    fetch('/menuitems', {
        credentials: 'include',
        method: 'post',
        body: formData
    })
        .then(function(){
            document.querySelector('div[data-cmd="categories"]').click();
        })
        .catch(function(err){
            console.log(err)
        })
}

function catDelete(caller){
    var formId = caller.dataset.id
    var frm = document.querySelector(`#${formId}`);
    var frmData = new FormData(frm);
    fetch('/menuitems', {
        credentials: 'include',
        method: 'delete',
        body: frmData
    })
    .then(function (data) {
        document.querySelector('div[data-cmd="categories"]').click();
    });

    // });
}

function catEdit(caller) {
    var formId = caller.dataset.id
    var frm = document.querySelector(`#${formId}`);
    var frmData = new FormData(frm);
    if(frmData.get('catname').trim().length < 1){
        alert('Kategorinavnet skal angives');
        return;
    }
    if(frmData.get('catpos').trim().length < 1){
        alert('Positionen skal angives');
        return;
    }
    fetch('/menuitems', {
        credentials: 'include',
        method: 'put',
        body: frmData
    })
        .then(function (data) {
            document.querySelector('div[data-cmd="categories"]').click();
        })
}