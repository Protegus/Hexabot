module.exports = async (client, userResolvable) => {
    const userId = userResolvable.replace(/[\\<>@#&!]/g, '');

    const userInfo = client.users.get(userId) || await client.getRESTUser(userId);
    if (!userInfo) return false;

    return userInfo;
};