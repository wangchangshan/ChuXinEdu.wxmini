const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const getToday = () => {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}

const getWeekName = (weekCode) => {
    var weekName = '';
    switch (weekCode){
        case "day1":
            weekName = '星期一';
            break;
        case "day2":
            weekName = '星期二';
            break;
        case "day3":
            weekName = '星期三';
            break;
        case "day4":
            weekName = '星期四';
            break;
        case "day5":
            weekName = '星期五';
            break;
        case "day6":
            weekName = '星期六';
            break;
        case "day7":
            weekName = '星期日';
            break;
    }
    return weekName;
}

module.exports = {
    formatTime: formatTime,
    getToday: getToday,
    getWeekName: getWeekName
}
