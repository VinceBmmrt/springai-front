const MAX_REQUESTS = 100;

function canSendRequest() {
  const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
  const data = JSON.parse(localStorage.getItem("requestCount") || "{}");

  if (data.date !== today) {
    localStorage.setItem(
      "requestCount",
      JSON.stringify({ date: today, count: 0 })
    );
    return true;
  }

  return data.count < MAX_REQUESTS;
}

function incrementRequestCount() {
  const today = new Date().toISOString().slice(0, 10);
  const data = JSON.parse(localStorage.getItem("requestCount") || "{}");

  if (data.date === today) {
    data.count += 1;
  } else {
    data.count = 1;
    data.date = today;
  }

  localStorage.setItem("requestCount", JSON.stringify(data));
}
