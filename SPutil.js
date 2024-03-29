/// Bu dosya javascript kütüphanelerinin hazır methodlarını barındırır.
/// Dosya Ana dizini "https://raw.githubusercontent.com/metinsevindik/SharepointUtilJs/master/SPutil.js" adresidir.
/// ***** ÖNEMLİ UYARI *****
/// Kullanmak için bu dosyayı kopyalayarak kullanınız. Uygulamalarınızda doğrudan bu dizini referans vermeyiniz.
/// Çünkü geliştirilmekte olan bu dosyada methodlarda değişiklik yapılması durumunda, eski kodunuz çalışmayabilir.

try {
  function Ajax(url, successFunc, errorfunc, isPost) {
    if (errorfunc == undefined) {
      errorfunc = function(err) {
        console.error("Ajax error: " + err);
      };
    }
    $.ajax({
      url: url,
      method: isPost == true ? "POST" : "GET",
      headers: {
        Accept: "application/json; odata=verbose"
      },
      success: successFunc,
      error: errorfunc
    });
  }

  if (!String.prototype.format) {
    String.prototype.format = function() {
      var args = arguments;
      return this.replace(/{(\d+)}/g, function(match, number) {
        return typeof args[number] != "undefined" ? args[number] : match;
      });
    };
  }

/// Kullanmak için bu dosyayı kopyalayarak kullanınız. Uygulamalarınızda doğrudan bu dizini referans vermeyiniz.
/// Çünkü geliştirilmekte olan bu dosyada methodlarda değişiklik yapılması durumunda, eski kodunuz çalışmayabilir.
/// updateItem("https://mydomain/test", "mySPListname", "B5A7074C........mylistID......61C2", 1, "myField", 444)
function updateItem(sitename, ListName, listId, itemid, fieldname, value) {
    var itemProperties = {
        '__metadata': { 'type': 'SP.Data.' + ListName + 'ListItem' }
    };
    itemProperties[fieldname] = value

    $.ajax({
        async: false,
        url: sitename + "/_api/web/lists(guid'" + listId + "')/items(" + itemid + ")",
        type: "POST",
        data: JSON.stringify(itemProperties),
        headers: {
            "Accept": "application/json;odata=verbose",
            "Content-Type": "application/json;odata=verbose",
            "X-RequestDigest": $("#__REQUESTDIGEST").val(),
            "IF-MATCH": "*",
            "X-HTTP-Method": "MERGE",
        },
        success: function (data) {
            console.log('Item updated successfully ' + id);
        },
        error: function (error) {
            console.log("Error: " + JSON.stringify(error));
        }
    });
}
  
  var SPoint = function(siteURL, listTitle) {
    var siteUrl = siteURL; //'/sites/MySiteCollection';

    var clientContext = new SP.ClientContext(siteUrl);
    var oList = clientContext
      .get_web()
      .get_lists()
      .getByTitle(listTitle);

    /**
     * Bu fonksiyon SP listesine yeni bir kayıt eklemek için kullanılır.
     * @param {object} items  kaydedilecek kayıtların obje halinde dizi olarak saklandığı parametredir.
     * Örneğin:
     * [
     *   [{name:'id',value:1},{name:'title',value:'testTitle1'}],
     *   [{name:'id',value:2},{name:'title',value:'testTitle2'}],
     *   [{name:'id',value:3},{name:'title',value:'testTitle3'}]
     * ]
     */
    this.createListItem = function(items, successFunc, errorFunc) {
      for (let itemindex = 0; itemindex < items.length; itemindex++) {
        this.oListItem = oList.addItem(new SP.ListItemCreationInformation());
        const itemFields = items[itemindex];
        for (let fieldindex = 0; fieldindex < itemFields.length; fieldindex++) {
          const field = itemFields[fieldindex];
          this.oListItem.set_item(field.name, field.value);
        }
        this.oListItem.update();
      }

      //clientContext.load(this.oListItem);
      clientContext.executeQueryAsync(
        successFunc
          ? successFunc
          : function() {
              console.log("Success");
            },
        errorFunc
          ? errorFunc
          : function(err) {
              console.log("error:" + err);
            }
      );
    };

    this.removeListItem = function(itemId, successFunc, errorFunc) {
      this.oListItem = oList.getItemById(itemId);
      this.oListItem.deleteObject();

      clientContext.executeQueryAsync(
        successFunc
          ? successFunc
          : function() {
              console.log("Success");
            },
        errorFunc
          ? errorFunc
          : function(err) {
              console.log("error:" + err);
            }
      );
    };
  };

  /* Array filter */
  Array.prototype.removeIf = function(callback) {
    var i = this.length;
    while (i--) {
      if (callback(this[i], i)) {
        this.splice(i, 1);
      }
    }
  };

  function GetURLParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split("&");
    for (var i = 0; i < sURLVariables.length; i++) {
      var sParameterName = sURLVariables[i].split("=");
      if (sParameterName[0] == sParam) {
        return sParameterName[1];
      }
    }
  }

  /**
   *
   * @param {*} key
   * https://gist.github.com/metinsevindik/9cc7642b041630f0403f4df5aae9e941
   */
  const groupBy = key => array =>
    array.reduce((objectsByKeyValue, obj) => {
      const value = obj[key];
      objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
      return objectsByKeyValue;
    }, {});

  function sortByKeyDesc(array, key) {
    return array.sort(function(a, b) {
      var x = a[key];
      var y = b[key];
      return x > y ? -1 : x < y ? 1 : 0;
    });
  }
  function sortByKeyAsc(array, key) {
    return array.sort(function(a, b) {
      var x = a[key];
      var y = b[key];
      return x < y ? -1 : x > y ? 1 : 0;
    });
  }
} catch (e) {
  console.log(e);
}

/**
 * @param {string} fieldDisplayNames : pasif olacak alanın görünen adı (dil seçeneğine dikkat edilmeli: default field nameler kullanıcı diline göre değişmekte!!)
 * @param {boolean} isactive : false ise alanlar kapatılır, true ise alanlar aktif olur.
 * Kullanımı:
 * disableField("field Display Name");
 * disableField("Title,");
 * disableField("Yıl "); -> Tüm Yıl ile başlayanları etkiler
 */
function disableField(fieldDisplayNames, isactive = false) {
  var fields = fieldDisplayNames.split(",");
  $.each(fields, function(i, item) {
    var closestTr = $('nobr:contains("' + item + '")').closest("tr");
    if (isactive) {
      closestTr.css("background-color", "#fff");
      closestTr.find("input").removeAttr("disabled");
      closestTr.find("select").removeAttr("disabled");
      closestTr.find("textarea").removeAttr("disabled");
      closestTr.find(".ms-dtinput a").attr("style", "display:block"); // Datetime picker
      $(closestTr.find('div [contenteditable="true"]')).attr(
        "contenteditable",
        "true"
      );
      $($(closestTr.find("td")[1]).find("div")[0]).removeClass(
        "ms-inputBoxDisabled"
      );
    } else {
      closestTr.css("background-color", "#f7f7f7");
      closestTr.find("input").attr("disabled", "disabled");
      closestTr.find("select").attr("disabled", "disabled");
      closestTr.find("textarea").attr("disabled", "disabled");
      closestTr.find(".ms-dtinput a").attr("style", "display:none"); // Datetime picker
      $(closestTr.find('div [contenteditable="true"]')).attr(
        "contenteditable",
        "false"
      );
      $($(closestTr.find("td")[1]).find("div")[0]).addClass(
        "ms-inputBoxDisabled"
      );
    }
  });
}



    /** Util.js dosyası import edildiğinde bazı field ler görünmez olduğundan bu fonksiyon buraya ayrıca eklendi.
     * 
     * 
     * @param {string} fieldDisplayNames : pasif olacak alanın görünen adı (dil seçeneğine dikkat edilmeli: default field nameler kullanıcı diline göre değişmekte!!)
     * @param {boolean} isactive : false ise alanlar kapatılır, true ise alanlar aktif olur.
     * Kullanımı:
     * disableField("Eylem Adı");
     * disableField("Eylem Adı,İkinci Alan Adı");
     * disableField("1. İzlem"); -> Tüm 1. İzlem ile başlayanları etkiler
     *
     */
    function disableField(fieldDisplayNames, isactive) {
        isactive = isactive || false;
        var fields = fieldDisplayNames.split(",");
        $.each(fields, function (i, item) {
            var closestTr = $('nobr:contains("' + item + '")').closest("tr");
            disableElement(closestTr, isactive);
        });
    }

function disableElement(closestTr, isactive) {
  isactive = isactive || false;
  if (isactive) {
    closestTr.css("background-color", "#fff");
    closestTr.find("input").removeAttr("disabled");
    closestTr.find("select").removeAttr("disabled");
    closestTr.find("textarea").removeAttr("disabled");
    closestTr.find(".ms-dtinput a").attr("style", "display:block"); // Datetime picker
    $(closestTr.find('div [contenteditable="true"]')).attr(
      "contenteditable",
      "true"
    );
    $($(closestTr.find("td")[1]).find("div")[0]).removeClass(
      "ms-inputBoxDisabled"
    );
    closestTr.find("#idAttachmentsTable tr td:nth-child(2)").show();
    closestTr.find(".sp-peoplepicker-delImage").show();
    closestTr
      .find(".sp-peoplepicker-topLevel")
      .removeClass("sp-peoplepicker-topLevelDisabled")
      .addClass("sp-peoplepicker-topLevel");
  } else {
    closestTr.css("background-color", "#f7f7f7");
    closestTr.find("input").attr("disabled", "disabled");
    closestTr.find("select").attr("disabled", "disabled");
    closestTr.find("textarea").attr("disabled", "disabled");
    closestTr.find(".ms-dtinput a").attr("style", "display:none"); // Datetime picker
    $(closestTr.find('div [contenteditable="true"]')).attr(
      "contenteditable",
      "false"
    );
    $($(closestTr.find("td")[1]).find("div")[0]).addClass(
      "ms-inputBoxDisabled"
    );
    closestTr.find("#idAttachmentsTable tr td:nth-child(2)").hide();
    closestTr.find(".sp-peoplepicker-delImage").hide();
    closestTr
      .find(".sp-peoplepicker-topLevel")
      .removeClass("sp-peoplepicker-topLevel")
      .addClass("sp-peoplepicker-topLevelDisabled");
  }
}

var Prerender=function(){
    function listPreRender(renderCtx) {
        var rows = renderCtx.ListData.Row;
        var filteredRows = rows.filter(function(row) {
            return MyUSerVariable.authorized===true;
        });
        renderCtx.ListData.Row = filteredRows;
        renderCtx.ListData.LastRow = filteredRows.length;
    }

    SP.SOD.executeFunc("clienttemplates.js", "SPClientTemplates", function() {
        webUrl = _spPageContextInfo.webAbsoluteUrl;
        //MyUSerVariable => GetUserDepartment(); // Check User Info to variables from sharepoint User list

        var MyContext = {
            Templates: {
                OnPreRender: listPreRender,
                OnPostRender: function(ctx) {
                    $('.holder').hide();
                }
            }
        };

        SPClientTemplates.TemplateManager.RegisterTemplateOverrides(MyContext);
    });
}
