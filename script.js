document.addEventListener("DOMContentLoaded", () => {
  // Load saved configuration from localStorage
  const savedData = JSON.parse(localStorage.getItem("padelConfig"));
  if (savedData) {
    document.getElementById("court-price").value = savedData.courtPrice;
    document.getElementById("court-count").value = savedData.courtCount;
    document.getElementById("hours-played").value = savedData.hoursPlayed;
    document.getElementById("member-count").value = savedData.members;
    document.getElementById("non-member-count").value = savedData.nonMembers;
    document.getElementById("discount").value = savedData.discount;
  }

  const calculateBtn = document.getElementById("calculate-btn");
  calculateBtn.addEventListener("click", () => {
    const courtPrice = parseFloat(document.getElementById("court-price").value);
    const courtCount = parseInt(document.getElementById("court-count").value);
    const hoursPlayed = parseFloat(
      document.getElementById("hours-played").value
    );
    const members = parseInt(document.getElementById("member-count").value);
    const nonMembers = parseInt(
      document.getElementById("non-member-count").value
    );
    const discount = parseFloat(document.getElementById("discount").value);

    if (members === 0 && nonMembers === 0) {
      alert("Please enter at least one player.");
      return;
    }

    const totalPrice = courtPrice * courtCount * hoursPlayed;

    const maxMemberDiscountCount = courtCount * 4;
    const memberDiscountCount = Math.min(members, maxMemberDiscountCount);

    const discountPerHour = ((courtPrice / 4) * discount) / 100;

    const totalDiscount = memberDiscountCount * discountPerHour * hoursPlayed;

    const toPay = totalPrice - totalDiscount;

    const memberPrice = toPay / (members + nonMembers * 2);
    const nonMemberPrice = memberPrice * 2;

    document.getElementById("price-result").textContent =
      totalPrice.toFixed(2) + " / " + toPay.toFixed(2);
    document.getElementById("member-result").textContent =
      memberPrice.toFixed(2);
    document.getElementById("non-member-result").textContent =
      nonMemberPrice.toFixed(2);

    // Save configuration to localStorage
    const config = {
      courtPrice,
      courtCount,
      hoursPlayed,
      members,
      nonMembers,
      discount,
    };
    localStorage.setItem("padelConfig", JSON.stringify(config));
  });
});
