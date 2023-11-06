namespace CoffeeShop.Services.Interfaces;

public interface IAccountService
{
     public Task<bool> SignIn(string username, string password);
     public Task<bool> SignOut();
     public Task<bool> ForgotPassword(string username);
     public Task<bool> ChangePassword(string username, string oldPassword, string newPassword);
}