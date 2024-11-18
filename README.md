// Utility function to make a GraphQL request
async function makeGraphQLRequest(query, JWToken) {
    const response = await fetch('https://01.kood.tech/api/graphql-engine/v1/graphql', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${JWToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
    });

    if (!response.ok) {
        console.error("Error in response:", response.statusText);
        return null;
    }

    return await response.json();
}

// Fetch user data including audits and XP
export async function fetchUserData(JWToken) {
    const query = `{
        user {
            id
            login
            transactions(order_by: { createdAt: desc }) {
                id
                type
                amount
                createdAt
            }
        }
    }`;

    try {
        const data = await makeGraphQLRequest(query, JWToken);
        console.log("Fetched user data:", data);

        if (!data || !data.data || !data.data.user) {
            console.error("No user data found.");
            return null;
        }

        // Calculate total XP and audit ratios
        const transactions = data.data.user.transactions;
        let totalXP = 0;
        let totalAuditsReceived = 0;
        let totalAuditsGiven = 0;

        transactions.forEach(transaction => {
            if (transaction.type === 'xp') {
                totalXP += transaction.amount;
            } else if (transaction.type === 'up') {
                totalAuditsGiven += transaction.amount;
            } else if (transaction.type === 'down') {
                totalAuditsReceived += transaction.amount;
            }
        });

        console.log(`Total XP: ${totalXP}`);
        console.log(`Total Audits Given: ${totalAuditsGiven}`);
        console.log(`Total Audits Received: ${totalAuditsReceived}`);
        
        return {
            userId: data.data.user.id,
            login: data.data.user.login,
            totalXP,
            totalAuditsGiven,
            totalAuditsReceived
        };
        
    } catch (error) {
        console.error("Error fetching user data:", error);
        localStorage.clear();
        return null;
    }
}

// Fetch transactions
export async function fetchTransactions(JWToken) {
    const query = `{
        transaction {
            amount
            type
            path
        }
    }`;

    try {
        const data = await makeGraphQLRequest(query, JWToken);
        console.log("Fetched transactions:", data);
        return data?.data?.transaction || [];
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return [];
    }
}
