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

  // Get the container element for extra players
  const extraPlayersContainer = document.querySelector(
    ".extra-players-container"
  );

  let extraPlayers = 0;

  function addExtraPlayer() {
    const extraPlayerDiv = document.createElement("div");
    extraPlayerDiv.classList.add("extra-player");

    const isMemberFormGroupDiv = document.createElement("div");
    isMemberFormGroupDiv.classList.add("form-group");
    extraPlayerDiv.appendChild(isMemberFormGroupDiv);

    const hoursPlayesFormGroupDiv = document.createElement("div");
    hoursPlayesFormGroupDiv.classList.add("form-group");
    extraPlayerDiv.appendChild(hoursPlayesFormGroupDiv);

    const memberLabel = document.createElement("label");
    memberLabel.classList.add("is-member-label");
    memberLabel.textContent = "Is Member:";
    memberLabel.setAttribute("for", "is-member-checkbox-" + extraPlayers);
    isMemberFormGroupDiv.appendChild(memberLabel);

    const memberOptionInput = document.createElement("input");
    memberOptionInput.id = "is-member-checkbox-" + extraPlayers;
    memberOptionInput.type = "checkbox";
    memberOptionInput.classList.add("is-member");
    isMemberFormGroupDiv.appendChild(memberOptionInput);

    const hoursPlayedLabel = document.createElement("label");
    hoursPlayedLabel.textContent = "Number of Hours Played:";
    hoursPlayesFormGroupDiv.appendChild(hoursPlayedLabel);

    const hoursPlayedInput = document.createElement("input");
    hoursPlayedInput.type = "number";
    hoursPlayedInput.step = "0.1";
    hoursPlayedInput.value = "1";
    hoursPlayesFormGroupDiv.appendChild(hoursPlayedInput);

    // Append the extra player div to the container
    extraPlayersContainer.appendChild(extraPlayerDiv);

    extraPlayers++;
  }

  function getExtraPlayers() {
    const extraPlayers = document.querySelectorAll(".extra-player");
    const players = [];
    extraPlayers.forEach((player) => {
      const isMember = player.querySelector(".is-member").checked;
      const hoursPlayed = parseFloat(
        player.querySelector("input[type='number']").value
      );
      if (hoursPlayed > 0) {
        players.push({ isMember, hoursPlayed });
      }
    });
    return players;
  }

  // Add event listener to the "Extra Players" button
  const addExtraPlayerBtn = document.querySelector(".add-extra-player-btn");
  addExtraPlayerBtn.addEventListener("click", addExtraPlayer);

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

    const allPlayers = [];
    for (let i = 0; i < members; i++) {
      allPlayers.push({ isMember: true, hoursPlayed });
    }
    for (let i = 0; i < nonMembers; i++) {
      allPlayers.push({ isMember: false, hoursPlayed });
    }
    const extraPlayers = getExtraPlayers();
    allPlayers.push(...extraPlayers);

    const maxMemberDiscountCount = courtCount * 4;
    const discountPerHour = ((courtPrice / 4) * discount) / 100;

    let totalMemeberHours = 0;
    let totalNonMemberHours = 0;

    let totalDiscount = 0;
    let appliedDiscounts = 0;
    for (const player of allPlayers) {
      if (player.isMember) {
        if (appliedDiscounts < maxMemberDiscountCount) {
          totalDiscount += discountPerHour * player.hoursPlayed;
          appliedDiscounts++;
        }
        totalMemeberHours += player.hoursPlayed;
      } else {
        totalNonMemberHours += player.hoursPlayed;
      }
    }

    const toPay = totalPrice - totalDiscount;

    const memberHourPrice =
      toPay / (totalMemeberHours + totalNonMemberHours * 2);
    const nonMemberHourPrice = memberHourPrice * 2;

    const memberPrice = hoursPlayed * memberHourPrice;
    const nonMemberPrice = hoursPlayed * nonMemberHourPrice;

    document.getElementById("price-result").textContent =
      totalPrice.toFixed(2) + " / " + toPay.toFixed(2);
    document.getElementById("member-result").textContent =
      memberPrice.toFixed(2);
    document.getElementById("non-member-result").textContent =
      nonMemberPrice.toFixed(2);

    const containerDiv = document.getElementById("container");
    const tempResults = containerDiv.querySelectorAll(".temp-result");
    tempResults.forEach((result) => {
      containerDiv.removeChild(result);
    });
    const set = new Set();
    for (const extraPlayer of extraPlayers) {
      const price =
        extraPlayer.hoursPlayed *
        (extraPlayer.isMember ? memberHourPrice : nonMemberHourPrice);
      const content = `For ${
        extraPlayer.isMember ? "member" : "non-member"
      } and hours ${extraPlayer.hoursPlayed} : ${price.toFixed(2)}`;
      if (set.has(content)) {
        continue;
      }
      set.add(content);

      const p = document.createElement("p");
      p.classList.add("temp-result");
      p.textContent = content;
      containerDiv.appendChild(p);
    }

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
