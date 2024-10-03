import { Body, Controller, Get, Post, Render, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { newAccountDTO } from './newAccount.dto';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @Render('index')
  getHello() {
    return {
      message: this.appService.getHello()
    };
  }

  #accounts = [
    {
      id: "1234-5678",
      owner: "Admin",
      balance: 300000
    },
    {
      id: "2345-6789",
      owner: "Bob",
      balance: 300000
    },
    {
      id: "3456-4567",
      owner: "David",
      balance: 300000
    }

  ]


  @Get("newAccount")
  @Render("newAccountForm")
  newAccountForm() {
    return{
      errors: [],
      data: {}
    }
  }

  @Post("newAccount")
  newAccount
    (@Body() accountData: newAccountDTO,
    @Res() response: Response
  ) {

    const errors: string[] = []

    if (!accountData.balance || !accountData.id || !accountData.owner) {
        errors.push("Minden mezőt kötelező megadni!")
    }

    if(!/^\d{4}-\d{4}$/.test(accountData.id)){
      errors.push('A számlaszám nem megfelelő formátomú!')
    }

    const balance = parseInt(accountData.balance)
    if(isNaN(balance))
    {
      errors.push("A kezdő érték szám kell, hogy legyen")
    }
    if(balance < 0)
    {
      errors.push("A kezdő érték nem lehet negatív")
    }

    if(this.#accounts.find(e => e.id == accountData.id) != undefined)
    {
      errors.push("Ilyen azonosítójú számla már létezik")
    }

    let newAccount = {
      id: accountData.id,
      owner: accountData.owner,
      balance: parseInt(accountData.balance)
    }

    if(errors.length > 0)
    {
       response.render('newAccountForm', {
        errors,
        data: accountData
      })
      return
    }

    this.#accounts.push(newAccount)

    response.redirect(303, '/newAccountSuccess')
  }

  @Get('newAccountSuccess')
  @Render("success")
  newAccountSuccess() {
    return {
      accounts: this.#accounts.length
    }
  }



}
