using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProEventos.API.Extensions;
using ProEventos.Application.Contratos;
using ProEventos.Application.DTOs;

namespace ProEventos.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly IAccountService _accountService;
        private readonly ITokenService _tokenService;

        public AccountController(IAccountService accountService, ITokenService tokenService)
        {
            _accountService = accountService;
            _tokenService = tokenService;
        }

        [HttpGet("GetUser")]
        public async Task<IActionResult> GetUser()
        {
            try
            {
                var userName = User.GetUserName();
                var user = await _accountService.GetUserByUserNameAsync(userName);
                return Ok(user);
            }
            catch (System.Exception ex)
            {
               return this.StatusCode(StatusCodes.Status500InternalServerError, 
               $"Erro ao tentar recuperar usuário. Erro: {ex.Message}");
            }
        }

        [HttpPost("Register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register(UserDTO userDTO)
        {
            try
            {
                if(await _accountService.UserExists(userDTO.Username))
                    return BadRequest("Usuário ja existe.");
                var user = await _accountService.CreateAccountAsync(userDTO);
                if(user != null)
                    return Ok(new {
                    userName = user.UserName,
                    PrimeiroNome = user.PrimeiroNome,
                    token = _tokenService.CreateToken(user).Result
                });
                return BadRequest("Usuário não criado, tente novamente mais tarde!");
            }
            catch (System.Exception ex)
            {
               return this.StatusCode(StatusCodes.Status500InternalServerError, 
               $"Erro ao tentar registrar usuário. Erro: {ex.Message}");
            }
        }

        [HttpPost("Login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login(UserLoginDTO userLogin)
        {
            try
            {
                var user = await _accountService.GetUserByUserNameAsync(userLogin.UserName); 
                if (user == null) return Unauthorized("Usuário ou senha inválidos");
                var result = await _accountService.CheckUserPasswordAsync(user, userLogin.Password);
                if(!result.Succeeded) return Unauthorized("Usuário ou senha inválidos");
                return Ok(new {
                    userName = user.UserName,
                    PrimeiroNome = user.PrimeiroNome,
                    token = _tokenService.CreateToken(user).Result
                });
            }
            catch (System.Exception ex)
            {
               return this.StatusCode(StatusCodes.Status500InternalServerError, 
               $"Erro ao tentar realizar login. Erro: {ex.Message}");
            }
        }

        [HttpPut("UpdateUser")]
        public async Task<IActionResult> UpdateUser(UserUpdateDTO userUpdateDTO)
        {
            try
            {
                var user = await _accountService.GetUserByUserNameAsync(User.GetUserName());
                if(user == null) return Unauthorized("Usúario inválido.");
                var userRetorno = await _accountService.UpdateAccount(userUpdateDTO);
                if(userRetorno == null) return NoContent();
                return Ok(userRetorno);
            }
            catch (System.Exception ex)
            {
               return this.StatusCode(StatusCodes.Status500InternalServerError, 
               $"Erro ao tentar atualizar usuário. Erro: {ex.Message}");
            }
        }
    }
}