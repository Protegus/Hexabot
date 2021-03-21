module.exports = (message, roleResolvable) => {
    if (!message.guild) return false;
    
    const roles = message.guild.roles;
    const role = roles.get(roleResolvable) 
        || roles.get(roleResolvable.replace(/[\\<>@#&!]/g, '')) 
        || roles.find(r => r.name.toLowerCase() === roleResolvable.toLowerCase());

    if (!role) return false;
    return role;
};