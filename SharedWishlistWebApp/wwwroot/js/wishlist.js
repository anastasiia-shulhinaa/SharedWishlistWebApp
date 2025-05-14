const wishlistUri = 'api/wishlists';
const giftItemUri = 'api/gift-items';
const guestUri = 'api/guests';
const reservationUri = 'api/gift-reservations';
let gifts = [];

function createWishlist() {
    console.log('createWishlist called');
    // Prevent concurrent submissions
    if (isSubmitting) {
        console.log('Submission in progress, ignoring');
        return;
    }

    // Check if a wishlist is already created
    const existingWishlistId = localStorage.getItem('wishlistId');
    if (existingWishlistId) {
        console.log('Wishlist already exists with ID:', existingWishlistId);
        document.getElementById('wishlist-created').innerText = `Wishlist already created! Share code: ${localStorage.getItem('shareCode') || 'unknown'}`;
        document.getElementById('add-gift-section').style.display = 'block';
        document.getElementById('wishlist-id').value = existingWishlistId;
        document.getElementById('owner-id').value = localStorage.getItem('ownerId') || '';
        return;
    }

    const title = document.getElementById('wishlist-title').value.trim();
    const ownerName = document.getElementById('owner-name').value.trim();
    const eventDate = document.getElementById('event-date').value;

    if (!title || !ownerName) {
        console.log('Validation failed: Title and OwnerName are required');
        document.getElementById('wishlist-created').innerText = 'Error: Title and Owner Name are required';
        return;
    }

    const wishlist = {
        title,
        ownerName,
        eventDate: eventDate || null
    };
    console.log('Wishlist data:', wishlist);

    // Disable submit button and set submitting flag
    const submitButton = document.querySelector('input[type="submit"]');
    submitButton.disabled = true;
    isSubmitting = true;
    console.log('Sending fetch to:', wishlistUri);

    fetch(wishlistUri, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(wishlist)
    })
        .then(response => {
            console.log('Response status:', response.status, 'Status text:', response.statusText);
            console.log('Response headers:', [...response.headers.entries()]);
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(`HTTP error! Status: ${response.status}, Message: ${text}`);
                });
            }
            return response.json().catch(error => {
                throw new Error('Failed to parse JSON response: ' + error.message);
            });
        })
        .then(data => {
            console.log('Raw API response:', data);
            let wishlist, ownerId;
            // Handle tuple serialization (Item1/Item2)
            if (data.Item1 && data.Item2) {
                wishlist = data.Item1;
                ownerId = data.Item2;
            }
            // Handle named tuple (Wishlist/OwnerId)
            else if (data.Wishlist && data.OwnerId) {
                wishlist = data.Wishlist;
                ownerId = data.OwnerId;
            }
            // Handle empty or unexpected response
            else {
                console.error('Invalid response data:', data);
                throw new Error('Invalid response: No valid wishlist data returned. Response: ' + JSON.stringify(data));
            }

            // Validate wishlist has required properties
            if (!wishlist.id || !wishlist.shareCode) {
                throw new Error('Invalid wishlist data: missing id or shareCode');
            }

            // Store wishlist data
            localStorage.setItem('wishlistId', wishlist.id);
            localStorage.setItem('ownerId', ownerId);
            localStorage.setItem('shareCode', wishlist.shareCode);

            // Update UI
            document.getElementById('wishlist-created').innerText = `Wishlist created! Share code: ${wishlist.shareCode}`;
            document.getElementById('add-gift-section').style.display = 'block';
            document.getElementById('wishlist-id').value = wishlist.id;
            document.getElementById('owner-id').value = ownerId;
            document.getElementById('wishlist-title').value = '';
            document.getElementById('owner-name').value = '';
            document.getElementById('event-date').value = '';
        })
        .catch(error => {
            console.error('Unable to create wishlist:', error);
            document.getElementById('wishlist-created').innerText = `Error: ${error.message}`;
        })
        .finally(() => {
            // Re-enable submit button and clear submitting flag
            submitButton.disabled = false;
            isSubmitting = false;
        });
}

function addGiftItem() {
    const wishlistId = parseInt(document.getElementById('wishlist-id').value, 10);
    const ownerId = document.getElementById('owner-id').value;
    const title = document.getElementById('gift-title').value.trim();
    const description = document.getElementById('gift-description').value.trim();
    const link = document.getElementById('gift-link').value.trim();
    const price = parseFloat(document.getElementById('gift-price').value) || null;

    const gift = {
        title,
        description,
        link,
        price
    };

    fetch(`${giftItemUri}?wishlistId=${wishlistId}&ownerId=${ownerId}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(gift)
    })
        .then(response => response.json())
        .then(() => {
            document.getElementById('gift-title').value = '';
            document.getElementById('gift-description').value = '';
            document.getElementById('gift-link').value = '';
            document.getElementById('gift-price').value = '';
            alert('Gift added!');
        })
        .catch(error => console.error('Unable to add gift.', error));
}

function joinWishlist() {
    const shareCode = document.getElementById('share-code').value.trim();
    const name = document.getElementById('guest-name').value.trim();
    const contactInfo = document.getElementById('guest-contact').value.trim();

    const guest = {
        name,
        contactInfo
    };

    fetch(`${guestUri}/join?shareCode=${shareCode}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(guest)
    })
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('guestId', data.id);
            localStorage.setItem('shareCode', shareCode);
            document.getElementById('join-status').innerText = `Joined wishlist! Guest ID: ${data.id}`;
            document.getElementById('guest-wishlist-section').style.display = 'block';
            getWishlistForGuest(shareCode);
            document.getElementById('share-code').value = '';
            document.getElementById('guest-name').value = '';
            document.getElementById('guest-contact').value = '';
        })
        .catch(error => {
            document.getElementById('join-status').innerText = 'Failed to join wishlist.';
            console.error('Unable to join wishlist.', error);
        });
}

function getWishlistForGuest(shareCode) {
    fetch(`${wishlistUri}/share/${shareCode}`)
        .then(response => response.json())
        .then(data => displayWishlist(data))
        .catch(error => console.error('Unable to get wishlist.', error));
}

function displayWishlist(data) {
    const details = document.getElementById('wishlist-details');
    const tbody = document.getElementById('gift-items');
    details.innerText = `${data.title} (Event: ${data.eventDate ? new Date(data.eventDate).toLocaleDateString() : 'Not set'})`;
    tbody.innerHTML = '';

    gifts = data.giftItems || [];
    gifts.forEach(gift => {
        const tr = tbody.insertRow();

        const td1 = tr.insertCell(0);
        td1.appendChild(document.createTextNode(gift.title));

        const td2 = tr.insertCell(1);
        td2.appendChild(document.createTextNode(gift.description || ''));

        const td3 = tr.insertCell(2);
        td3.appendChild(document.createTextNode(gift.price ? `$${gift.price.toFixed(2)}` : ''));

        const td4 = tr.insertCell(3);
        const link = document.createElement('a');
        link.href = gift.link || '#';
        link.innerText = gift.link ? 'Buy' : '';
        link.target = '_blank';
        td4.appendChild(link);

        const td5 = tr.insertCell(4);
        const reservations = gift.reservations || [];
        const reservedText = reservations.map(r => `$${r.contributionAmount.toFixed(2)} by Guest ${r.guestId}`).join(', ');
        td5.appendChild(document.createTextNode(reservedText || 'None'));

        const td6 = tr.insertCell(5);
        const reserveButton = document.createElement('button');
        reserveButton.innerText = 'Reserve';
        reserveButton.onclick = () => showReserveForm(gift.id);
        td6.appendChild(reserveButton);
    });
}

function showReserveForm(giftId) {
    document.getElementById('reserve-gift-id').value = giftId;
    document.getElementById('guest-id').value = localStorage.getItem('guestId');
    document.getElementById('reserve-gift-section').style.display = 'block';
}

function reserveGift() {
    const giftId = parseInt(document.getElementById('reserve-gift-id').value, 10);
    const guestId = parseInt(document.getElementById('guest-id').value, 10);
    const contributionAmount = parseFloat(document.getElementById('contribution-amount').value);
    const splitCount = parseInt(document.getElementById('split-count').value) || null;

    const reservation = {
        contributionAmount,
        splitCount
    };

    fetch(`${reservationUri}?giftItemId=${giftId}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Guest-Id': guestId
        },
        body: JSON.stringify(reservation)
    })
        .then(response => response.json())
        .then(() => {
            getWishlistForGuest(localStorage.getItem('shareCode'));
            document.getElementById('reserve-gift-section').style.display = 'none';
            document.getElementById('contribution-amount').value = '';
            document.getElementById('split-count').value = '';
            alert('Gift reserved!');
        })
        .catch(error => console.error('Unable to reserve gift.', error));
}