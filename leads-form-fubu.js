$.ajax({
  type: "POST",
  data: "",
  url: "https://services.astrologyanswers.com/aa/get_day_year",
  dataType: "json",
}).done(function (data) {
  document.getElementById("day").innerHTML = data.birth_day;
  document.getElementById("year").innerHTML = data.birth_year;
});

$(document).ready(function () {
  $("#orderForm").submit(function (e) {
    e.preventDefault();
  });

  if (orderForm.AutocompleteTarget.value == "USA") {
    $(".state_div").hide();
  }

  function split(val) {
    return val.split(/,s*/);
  }

  function extractLast(term) {
    return split(term).pop();
  }

  $("#Contact0City3")
    // don"t navigate away from the field on tab when selecting an item
    .bind("keydown", function (event) {
      if (
        event.keyCode === $.ui.keyCode.TAB &&
        $(this).data("autocomplete").menu.active
      ) {
        event.preventDefault();
      }
    })
    .autocomplete({
      source: function (request, response) {
        $.getJSON(
          "https://services.astrologyanswers.com/aa/api/autocomplete",
          {
            term: extractLast(request.term),
            country: orderForm.AutocompleteTarget.value,
          },
          response
        );
      },
      search: function () {
        // custom minLength
        var term = extractLast(this.value);
        if (term.length < 2) {
          return false;
        }
      },
      focus: function () {
        // prevent value inserted on focus
        return false;
      },
      select: function (event, ui) {
        var terms = split(this.value);
        // remove the current input
        terms.pop();
        // add the selected item
        terms.push(ui.item.label);

        if (ui.item.value == "") {
          rderform.Contact0_birthplaceid.value = "";
        } else {
          rderform.Contact0_birthplaceid.value = ui.item.value;
        }
        // add placeholder to get the comma-and-space at the end
        terms.push("");
        this.value = terms.join("");
        return false;
      },
    });
});

var counterfield = 0;

function selectcountry() {
  rderform.Contact0City3.value = "";

  rderform.Contact0_birthplaceid.value = "";

  orderForm.AutocompleteTarget.value = orderForm.defaultcountry.value;

  if (orderForm.defaultcountry.value == "USA") {
    orderForm.Contact0_Birthcountry.value = "";
    orderForm.defaultstate.value = "";

    $(".state_div").show();
  } else {
    orderForm.Contact0_Birthcountry.value = orderForm.defaultcountry.value;
    rderform.Contact0City3.value = "";
    orderForm.defaultstate.value = "";
    $(".state_div").hide();
  }
  //return true;
  document.getElementById("showcityfield").style.display = "block";

  orderForm.defaultstate.value = "";

  orderForm.Contact0_Birthcountry.value = orderForm.defaultcountry.value;

  if (counterfield == 0) {
    $("#showcityfield").fadeIn(600);

    counterfield++;
  }
}

function selectstate() {
  orderForm.defaultcountry.value = "USA";
  document.getElementById("showcityfield").style.display = "block";

  rderform.Contact0City3.value = "";
  rderform.Contact0_birthplaceid.value = "";
  orderForm.Contact0_Birthcountry.value = orderForm.defaultstate.value;
  orderForm.AutocompleteTarget.value = orderForm.defaultstate.value;
}

function selectdiv(bplace, placeid) {
  needToConfirm = false;
  document.getElementById("searchField").value = bplace;
  document.getElementById("birthplaceid").value = placeid;

  document.getElementById("auto").style.display = "none";
  $("#auto").html("");
}

$.ajax({
  type: "POST",
  data: { Email: rderform.Email.value },
  url: "https://services.astrologyanswers.com/aa/get_birth_details",
  dataType: "json",
}).done(function (data) {
  //alert(data.birtcountry);
  rderform.Contact0FirstName.value = data.Contact0FirstName;
  rderform.month.selectedIndex = data.month;

  if (data.day) {
    rderform.day.selectedIndex = data.day;
  }

  //alert(data.year);

  if (data.year && data.year != "0000") {
    rderform.year.value = data.year;
  }
  rderform.Contact0_birthplaceid.value = data.Birthplaceid;
  rderform.Contact0_Birthcountry.value = data.birtcountry;
  rderform.AutocompleteTarget.value = data.birtcountry;

  //alert(rderform.unsure.checked);

  if (data.birthtime == "" || data.birthtime == null) {
    rderform.unsure.checked = true;
  } else {
    rderform.tobhr.value = data.leadhour;
    rderform.tobmin.value = data.leadmin;
    rderform.tobam.value = data.leadap;
  }

  var localbirthcity = localStorage.getItem("localbirthcity");
  var localbirthcountry = localStorage.getItem("localbirthcountry");

  if (
    localbirthcity != "" &&
    localbirthcountry != "" &&
    localbirthcity != null &&
    localbirthcountry != null
  ) {
    data.birtcity = localbirthcity;
    data.birtcountry = localbirthcountry;

    rderform.Contact0City3.value = data.birtcity;

    if (
      data.birtcountry == "Canada" ||
      data.birtcountry == "Australia" ||
      data.birtcountry == "United States" ||
      data.birtcountry == "United Kingdom" ||
      data.birtcountry == "New Zealand"
    ) {
      var strcountry = data.birtcountry;
      strcountry = strcountry.toUpperCase();
    } else {
      var strcountry = data.birtcountry;
    }

    console.log(data.birtcountry + "==" + data.birtcity);

    rderform.AutocompleteTarget.value = data.birtcountry;

    var theText = strcountry;
    $("#defaultcountry option:contains(" + theText + ")").attr(
      "selected",
      "selected"
    );
  } else {
    var countrystr = data.birtcountry;

    var countrystr_len = countrystr.length;

    if (countrystr != "" && countrystr_len > 2) {
      if (
        data.birtcountry == "Canada" ||
        data.birtcountry == "Australia" ||
        data.birtcountry == "United States" ||
        data.birtcountry == "United Kingdom" ||
        data.birtcountry == "New Zealand"
      ) {
        var strcountry = data.birtcountry;
        strcountry = strcountry.toUpperCase();
      } else {
        var strcountry = data.birtcountry;
      }

      var theText = strcountry;
      $("#defaultcountry option:contains(" + theText + ")").attr(
        "selected",
        "selected"
      );

      rderform.Contact0City3.value = data.birtcity;
    } else {
      if (data.wow_id >= 227 && data.wow_id <= 277) {
        $(".state_div").show();
        rderform.defaultcountry.value = "USA";
        document.getElementById("showcityfield").style.display = "block";

        rderform.Contact0City3.value = data.birtcity;
        document.getElementById("defaultstate").value = data.birtcountry;
      } else {
        $(".state_div").hide();
        rderform.defaultcountry.value = data.birtcountry;
        document.getElementById("showcityfield").style.display = "block";
        rderform.Contact0City3.value = data.birtcity;
      }
    }
  }
});

function trim(str) {
  return str.replace(/^s+|s+$/g, "");
}

function submitdata() {
  if (
    trim(rderform.Contact0FirstName.value) == "" ||
    trim(rderform.Contact0FirstName.value) == null
  ) {
    alert("Please enter your First Name");
    rderform.Contact0FirstName.focus();
    return false;
  }

  if (rderform.month.value == "") {
    alert("Please select your month of Birth");
    rderform.month.focus();
    return false;
  }

  if (rderform.day.value == "") {
    alert("Please select your day of Birth");
    rderform.day.focus();
    return false;
  }

  if (rderform.year.value == "") {
    alert("Please select your year of Birth");
    rderform.year.focus();
    return false;
  }

  if (rderform.defaultcountry.value == "") {
    alert("Please select your Country of Birth");
    rderform.defaultcountry.focus();
    return false;
  }

  if (rderform.defaultcountry.value == "USA") {
    if (rderform.defaultstate.value == "") {
      alert("Please select your State of Birth");
      rderform.defaultstate.value = "";
      rderform.defaultstate.focus();
      return false;
    }

    rderform.Contact0_Birthcountry.value =
      rderform.defaultstate.value;
  } else {
    rderform.Contact0_Birthcountry.value =
      rderform.defaultcountry.value;
  }
  if (document.getElementById("Contact0City3")) {
    if (rderform.Contact0City3.value == "") {
      alert("Please enter your Town/City of Birth");
      rderform.Contact0City3.focus();
      return false;
    }
  }

  var formdata = $("#orderForm").serializeArray();
  console.log(formdata);
  $.ajax({
    type: "POST",
    url: "https://services.astrologyanswers.com/aa/update_birth_details",
    data: {
        Email : rderform.Email.value,
        Contact0FirstName : rderform.Contact0FirstName.value,
        year : rderform.year.value,
        month : rderform.month.value,
        day : rderform.day.value,
        AutocompleteTarget : rderform.AutocompleteTarget.value,
        Contact0City3 : rderform.Contact0City3.value,
        Contact0_birthplaceid : rderform.Contact0_birthplaceid.value,
        tobhr : rderform.tobhr.value,
        tobmin : rderform.tobmin.value,
        tobam : rderform.tobam.value
    },
    dataType: "json",
  }).done(function (data) {
    //alert(data.status);
    if (data.status == "success") {
      window.location = "";
    }
  });
}
