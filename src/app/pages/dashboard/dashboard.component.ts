/*
 * Polkascan PRE Explorer GUI
 *
 * Copyright 2018-2019 openAware BV (NL).
 * This file is part of Polkascan.
 *
 * Polkascan is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Polkascan is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Polkascan. If not, see <http://www.gnu.org/licenses/>.
 *
 * dashboard.component.ts
 */

import { Component, OnInit } from '@angular/core';
import {DocumentCollection} from 'ngx-jsonapi';
import {Block} from '../../classes/block.class';
import {interval, Observable, Subscription} from 'rxjs';
import {Networkstats} from '../../classes/networkstats.class';
import {BlockService} from '../../services/block.service';
import {NetworkstatsService} from '../../services/networkstats.service';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {BalanceTransfer} from '../../classes/balancetransfer.class';
import {BalanceTransferService} from '../../services/balance-transfer.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public blocks: DocumentCollection<Block>;
  public balanceTransfers: DocumentCollection<BalanceTransfer>;
  public networkstats$: Observable<Networkstats>;

  blockSearchText: string;
  private blockUpdateSubsription: Subscription;

  constructor(
    private blockService: BlockService,
    private balanceTransferService: BalanceTransferService,
    private networkstatsService: NetworkstatsService,
    private router: Router,
    private http: HttpClient) {

  }

  ngOnInit() {

    this.getBlocks();
    this.networkstats$ = this.networkstatsService.get('alexander');

    const blockUpdateCounter = interval(10000);

    this.blockUpdateSubsription = blockUpdateCounter.subscribe( n => this.getBlocks());
  }

  getBlocks(): void {
    this.blockService.all({
      page: { number: 0}
    }).subscribe(blocks => (this.blocks = blocks));

    this.balanceTransferService.all({
      page: { number: 0}
    }).subscribe(balanceTransfers => (this.balanceTransfers = balanceTransfers));
  }

  searchBlock(): void {
    if (this.blockSearchText.includes('-')) {
      this.router.navigate(['system', 'extrinsic', this.blockSearchText]);
    } else if (+this.blockSearchText) {
      this.router.navigate(['system', 'block', this.blockSearchText]);
    } else {
      this.router.navigate(['system', 'account', this.blockSearchText]);
    }
  }

  ngOnDestroy() {
    // Will clear when component is destroyed e.g. route is navigated away from.
    this.blockUpdateSubsription.unsubscribe();
  }
}