module.exports = (message, memberResolvable) => {
    if (!message.guild) return false;

    const members = message.guild.members;
    const member = members.get(memberResolvable) || members.get(memberResolvable.replace(/[\\<>@#&!]/g, ''));

    if (!member) return false;
    return member;
};