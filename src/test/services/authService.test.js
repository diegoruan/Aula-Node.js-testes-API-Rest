import { describe, expect, it } from '@jest/globals';
import bcryptjs from 'bcryptjs';
import AuthService from '../../services/authService';
import Usuario from '../../models/usuario';

const authService = new AuthService();

describe('Testando a authService.cadastrarUsuario', () => {
  it('O usuário deve possuir um nome, email e senha', async () => {
    const usuarioMock = {
      nome: 'Raphael',
      email: 'R@R.com',
    };

    const usuarioSalvo = authService.cadastrarUsuario(usuarioMock);

    await expect(usuarioSalvo).rejects.toThrowError('A senha de usuário é obrigatorio!');
  });

  it('A senha do usuário precisa ser criptografada quando for salva no banco de dados', async () => {
    const data = {
      nome: 'Raphael',
      email: 'R@R.com',
      senha: 'teste123',
    };

    const resultado = await authService.cadastrarUsuario(data);
    const senhaIguais = await bcryptjs.compare('teste123', resultado.content.senha);

    expect(senhaIguais).toStrictEqual(true);

    await Usuario.excluir(resultado.content.id);
  });

  it('Não pode ser cadastrado um usuário com e-mail duplicado', async () => {
    const usuarioMock = {
      nome: 'Diego',
      email: 'D@D.com',
      senha: 'teste123',
    };

    const usuarioSalvo = authService.cadastrarUsuario(usuarioMock);

    await expect(usuarioSalvo).rejects.toThrowError('Este email já esta cadastrado!');
  });

  it('Ao cadastrar um usuário, deve ser retornado mensagem informando que o usuário foi cadastrado', async () => {
    const data = {
      nome: 'Thiago',
      email: 'T@T.com',
      senha: 'teste123',
    };

    const resultado = await authService.cadastrarUsuario(data);

    expect(resultado.message).toEqual('usuario criado');

    await Usuario.excluir(resultado.content.id);
  });

  it('Ao cadastrar um usuário, validar retorno do usuário', async () => {
    const data = {
      nome: 'Thiago',
      email: 'T@T.com',
      senha: 'teste123',
    };

    const resultado = await authService.cadastrarUsuario(data);

    expect(resultado.content).toMatchObject(data);

    await Usuario.excluir(resultado.content.id);
  });
});
