var date_changed = false;

const scanElems = (next) => {
  let textBox = document.querySelector("textarea");
  if (textBox) {
    if (!textBox.classList.contains("dir-auto")) {
      textBox.classList.add("dir-auto");
    }
  }

  var elements = [].slice.call(document.querySelectorAll("textarea"));
  var items =
    [].slice.call(document.querySelectorAll(".checklist-new-item-text")) ?? [];

  elements.concat(items);

  if (elements) {
    elements.forEach((el) => {
      el.addEventListener("keyup", (e) => {
        var value = e.target.value,
          farsiChars = value.match(/[\u0600-\u06FF]/g),
          hebrewChars = value.match(/[\u0590-\u05FF]/g),
          spaceChars = value.match(/\s/g),
          count = value.length,
          farsiCount = farsiChars ? farsiChars.length : 0,
          hebrewCount = hebrewChars ? hebrewChars.length : 0,
          spaceCount = spaceChars ? spaceChars.length : 0,
          rtlCount = farsiCount + hebrewCount;
        latinCount = count - farsiCount - spaceCount - hebrewCount;

        if (!e.target.classList.contains("rtl") && rtlCount > latinCount) {
          e.target.classList.add("mango_rtl");
          e.target.classList.remove("mango_ltr");
        } else if (
          !e.target.classList.contains("rtl") &&
          rtlCount < latinCount
        ) {
          e.target.classList.add("mango_ltr");
          e.target.classList.remove("mango_rtl");
        }
      });
    });
  }

  var dates = [].slice.call(document.querySelectorAll(".js-due-date-text"));

  if (dates.length) {
    var months = {
      Jan: 1,
      Feb: 2,
      Mar: 3,
      Apr: 4,
      May: 5,
      Jun: 6,
      Jul: 7,
      Aug: 8,
      Sep: 9,
      Oct: 10,
      Nov: 11,
      Dec: 12,
    };
    var persianMonths = {
      1: "فروردین",
      2: "اردیبهشت",
      3: "خرداد",
      4: "تیر",
      5: "مرداد",
      6: "شهریور",
      7: "مهر",
      8: "آبان",
      9: "آذر",
      10: "دی",
      11: "بهمن",
      12: "اسفند",
    };

    dates.forEach((date) => {
      if (date.classList.contains("converted")) return;
      // let year = new Date().getFullYear();
      let day = null;
      let month = null;
      let text = date.innerHTML;

      text = text.replace(",", ""); // May 2 2021
      text = text.split(" ");

      let year = text[2] ?? new Date().getFullYear();

      month = months[text[0]];
      day = text[1];

      const converted = gregorian_to_jalali(+year, +month, +day);
      date.classList.add("converted");
      if (text[2]) {
        date.innerHTML = `${converted[0]}/${converted[1]}/${converted[2]}`;
      } else {
        date.innerHTML = `${converted[2]} ${persianMonths[converted[1]]}`;
      }
      date.classList.add("mango_ltr");
    });
  }

  const persian = {
    0: "۰",
    1: "۱",
    2: "۲",
    3: "۳",
    4: "۴",
    5: "۵",
    6: "۶",
    7: "۷",
    8: "۸",
    9: "۹",
  };

  function traverse(el) {
    if (el.nodeType == 3) {
      var list = el.data.match(/[0-9]/g);
      if (list != null && list.length != 0) {
        for (var i = 0; i < list.length; i++)
          el.data = el.data.replace(list[i], persian[list[i]]);
      }
    }
    for (var i = 0; i < el.childNodes.length; i++) {
      traverse(el.childNodes[i]);
    }
  }
  traverse(document.body);
};

handler = setInterval(scanElems, 1000);
