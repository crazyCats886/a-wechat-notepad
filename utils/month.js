function getNowMonthContent(month,contents){
  let nowMonth=[];
  for(let i=0;i<contents.length;i++){
    if(contents[i].month==month){
      nowMonth.push(contents[i]);
    }
  }
  return nowMonth;
}

function getMonthContent(month,contents){
  let nowMonth = {};
  let lastMonth = {};
  let beforeLastMonth = {};
  nowMonth.content=[];
  lastMonth.content=[];
  beforeLastMonth.content=[];
  let length = contents.length;
  if (month == 1) {
    nowMonth.month = 1;
    lastMonth.month = 12;
    beforeLastMonth.month = 11;
    for (let i = 0; i < length; i++) {
      if (contents[i].month == 1) {
        nowMonth.content.push(contents[i]);
      } else if (contents[i].month == 12) {
        lastMonth.content.push(contents[i]);
      } else if (contents[i].month == 11) {
        beforeLastMonth.content.push(content[i]);
      }
    }
  }
  if (month == 2) {
    nowMonth.month = 2;
    lastMonth.month = 1;
    beforeLastMonth.month = 12;
    for (let i = 0; i < length; i++) {
      if (contents[i].month == 2) {
        nowMonth.content.push(contents[i]);
      } else if (contents[i].month == 1) {
        lastMonth.content.push(contents[i]);
      } else if (contents[i].month == 12) {
        beforeLastMonth.content.push(content[i]);
      }
    }
  }
  if(month !=1 && month !=2){
    nowMonth.month = month;
    lastMonth.month = month-1;
    beforeLastMonth.month = month-2;
    for (let i = 0; i < length; i++) {
      if (contents[i].month == month) {
        nowMonth.content.push(contents[i]);
      } else if (contents[i].month == month-1) {
        lastMonth.content.push(contents[i]);
      } else if (contents[i].month == month-2) {
        beforeLastMonth.content.push(content[i]);
      }
    }
  }
  return [nowMonth,lastMonth,beforeLastMonth];
}

module.exports={
  month:getMonthContent,
  monthContent: getNowMonthContent
}