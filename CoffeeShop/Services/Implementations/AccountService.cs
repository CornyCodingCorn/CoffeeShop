using CoffeeShop.Services.Interfaces;

namespace CoffeeShop.Services.Implementations;

public class AccountService : IAccountService
{
    public Task<bool> SignIn(string username, string password)
    {
        throw new NotImplementedException();
    }

    public Task<bool> SignOut()
    {
        throw new NotImplementedException();
    }

    public Task<bool> ForgotPassword(string username)
    {
        throw new NotImplementedException();
    }

    public Task<bool> ChangePassword(string username, string oldPassword, string newPassword)
    {
        throw new NotImplementedException();
    }
}