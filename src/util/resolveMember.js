module.exports = (message, memberResolvable) => {
    if (!message.guild) return false;

    console.log(memberResolvable.toLowerCase());
    try {
        const members = message.guild.members;
        const member = members.get(memberResolvable) || members.get(memberResolvable.replace(/[\\<>@#&!]/g, ''));

        if (!member) return false;
        return member;
    } catch (e) {
        console.error(e);
        return false;
    }
};