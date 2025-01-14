import { paginate } from "@/Util";
import ServiceBase from "@/Services/ServiceBase";

const API_URL = "https://api.prismamonitor.com/v1";

export type DecimalTimeSeries = {
  timestamp: number;
  value: number;
};

export type DecimalLabelledSeries = {
  label: string;
  value: number;
};

export type HistoricalTroveManagerData = {
  manager: string;
  data: DecimalTimeSeries[];
};

export type CollateralRatioDecilesData = {
  label: string;
  data: number;
};

export type PoolStableOperation = {
  user: string;
  amount: number;
  timestamp: number;
  hash: string;
};

export type StableFlows = {
  withdrawals: DecimalTimeSeries[];
  deposits: DecimalTimeSeries[];
};

export type StableKPI = {
  price: number;
  supply: number;
  volume: number;
  depth: number;
};

export type DepthNumbers = {
  amounts: number[];
  prices: number[];
};

export type PoolDepth = {
  name: string;
  address: string;
  tokens: string[];
  bid: DepthNumbers;
  ask: DepthNumbers;
};

export type PriceImpact = {
  amount: number;
  impact: number;
};

export type CollateralInfo = {
  price: number;
  supply: number;
  tvl: number;
  share: number;
  risk: string;
};

export type Redemption = {
  redeemer: string;
  attempted_debt_amount: number;
  actual_debt_amount: number;
  collateral_sent: number;
  collateral_sent_usd: number;
  collateral_sent_to_redeemer: number;
  collateral_sent_to_redeemer_usd: number;
  collateral_fee: number;
  collateral_fee_usd: number;
  troves_affected: string[];
  troves_affected_count: number;
  transaction: string;
  timestamp: number;
};

export type TroveStatus = "Open" | "Closed";
export type Trove = {
  owner: string;
  status: TroveStatus;
  collateral_usd: number;
  debt: number;
  collateral_ratio: number;
  created_at: number;
  last_update: number;
};

export type TroveSnapshotData = {
  operation: string;
  collateral: number;
  collateral_usd: number;
  cr: number | null;
  debt: number;
  stake: number;
  block: number;
  timestamp: number;
  hash: string;
};

export type TroveHistoryData = {
  collateral: number;
  collateral_usd: number;
  cr: number | null;
  debt: number;
  timestamp: number;
};

export type Position = {
  ratio: number;
  collateral_usd: number;
  trove_count: number;
};

export type RatioPosition = {
  rank: number | null;
  total_positions: number;
  ratio: number | null;
  positions: Position[];
};

export default class PrismaService extends ServiceBase {
  // Vault / Trove manager endpoints
  public async getHistoricalOpenTrovesOverview(
    chain: string,
    period: string
  ): Promise<{ managers: HistoricalTroveManagerData[] }> {
    return this.fetch(
      `${API_URL}/managers/${chain}/open_troves?period=${period}`
    );
  }

  public async getHistoricalCollateralRatiosOverview(
    chain: string,
    period: string
  ): Promise<{ managers: HistoricalTroveManagerData[] }> {
    return this.fetch(
      `${API_URL}/managers/${chain}/collateral_ratios?period=${period}`
    );
  }

  public async getCollateralRatioGrouped(
    chain: string,
    period: string
  ): Promise<HistoricalTroveManagerData> {
    return this.fetch(
      `${API_URL}/managers/${chain}/global_collateral_ratio?period=${period}`
    );
  }

  public async getHistoricalCollateralOverview(
    chain: string,
    period: string
  ): Promise<{ managers: HistoricalTroveManagerData[] }> {
    return this.fetch(
      `${API_URL}/managers/${chain}/collateral?period=${period}`
    );
  }

  public async getRatioDistributionGrouped(
    chain: string
  ): Promise<{ deciles: CollateralRatioDecilesData[] }> {
    return this.fetch(`${API_URL}/managers/${chain}/ratio_distribution`);
  }

  public async getLargeTrovePositions(
    chain: string,
    manager: string,
    unit: string
  ): Promise<{ positions: DecimalLabelledSeries[] }> {
    return this.fetch(
      `${API_URL}/managers/${chain}/${manager}/large_positions?unit=${unit}`
    );
  }

  public async getVaultCollateralRatio(
    chain: string,
    manager: string,
    period: string
  ): Promise<{ ratio: DecimalTimeSeries[] }> {
    return this.fetch(
      `${API_URL}/managers/${chain}/${manager}/collateral_ratio?period=${period}`
    );
  }

  public async getVaultTroveCount(
    chain: string,
    manager: string,
    period: string
  ): Promise<{ count: DecimalTimeSeries[] }> {
    return this.fetch(
      `${API_URL}/managers/${chain}/${manager}/open_trove_count?period=${period}`
    );
  }

  public async getTroveDistribution(
    chain: string,
    manager: string,
    unit: string
  ): Promise<{ distribution: DecimalLabelledSeries[] }> {
    return this.fetch(
      `${API_URL}/managers/${chain}/${manager}/histograms?unit=${unit}`
    );
  }

  // Collateral endpoints
  public async getCollateralPrices(
    chain: string,
    collateral: string,
    period: string
  ): Promise<{ oracle: DecimalTimeSeries[]; market: DecimalTimeSeries[] }> {
    return this.fetch(
      `${API_URL}/collateral/${chain}/${collateral}/prices?period=${period}`
    );
  }

  public async getCollateralPriceImpact(
    chain: string,
    collateral: string
  ): Promise<{ impact: PriceImpact[] }> {
    return this.fetch(`${API_URL}/collateral/${chain}/${collateral}/impact`);
  }

  public async getCollateralInfo(
    chain: string,
    collateral: string
  ): Promise<{ info: CollateralInfo }> {
    return this.fetch(`${API_URL}/collateral/${chain}/${collateral}/info`);
  }

  // Stability pool endpoints
  public async getPoolTvl(
    chain: string,
    period: string
  ): Promise<{ deposits: DecimalTimeSeries[] }> {
    return this.fetch(`${API_URL}/pool/${chain}/deposits?period=${period}`);
  }

  public async getStableFlow(
    chain: string,
    period: string
  ): Promise<StableFlows> {
    return this.fetch(
      `${API_URL}/pool/${chain}/stable_operations?period=${period}`
    );
  }

  public async getStableDistribution(
    chain: string
  ): Promise<{ distribution: DecimalLabelledSeries[] }> {
    return this.fetch(`${API_URL}/pool/${chain}/histogram/deposits`);
  }

  public async getCumulativeWithdrawals(
    chain: string,
    period: string
  ): Promise<{ withdrawals: DecimalTimeSeries[] }> {
    return this.fetch(
      `${API_URL}/pool/${chain}/cumulative_withdrawals?period=${period}`
    );
  }

  public async getTopStableDeposits(
    chain: string,
    top: number,
    period: string
  ): Promise<{ operations: PoolStableOperation[] }> {
    return this.fetch(
      `${API_URL}/pool/${chain}/top/stable_deposits?top=${top}&period=${period}`
    );
  }

  public async getTopStableWithdrawals(
    chain: string,
    top: number,
    period: string
  ): Promise<{ operations: PoolStableOperation[] }> {
    return this.fetch(
      `${API_URL}/pool/${chain}/top/stable_withdrawals?top=${top}&period=${period}`
    );
  }

  // mkUSD endpoints
  public async getPriceHistory(
    chain: string,
    period: string
  ): Promise<{ prices: DecimalTimeSeries[] }> {
    return this.fetch(`${API_URL}/mkusd/${chain}/history?period=${period}`);
  }

  public async getPriceHistogram(
    chain: string,
    bins: number,
    period: string
  ): Promise<{ histogram: DecimalLabelledSeries[] }> {
    return this.fetch(
      `${API_URL}/mkusd/${chain}/histogram?period=${period}&bins=${bins}`
    );
  }

  public async getLargeStableCoinHolders(
    chain: string
  ): Promise<{ holders: DecimalLabelledSeries[] }> {
    return this.fetch(`${API_URL}/mkusd/${chain}/holders`);
  }

  public async getStableCoinKPI(chain: string): Promise<{ info: StableKPI }> {
    return this.fetch(`${API_URL}/mkusd/${chain}/general`);
  }

  public async getCurvePoolDepth(
    chain: string
  ): Promise<{ depth: PoolDepth[] }> {
    return this.fetch(`${API_URL}/mkusd/${chain}/depth`);
  }

  public async getRedemptions(
    chain: string,
    manager: string
  ): Promise<Redemption[]> {
    const fs = (page: number) => {
      return this.fetch<{
        redemptions: Redemption[];
      }>(
        `${API_URL}/redemptions/${chain}/${manager}?items=100&page=${page}&order_by=block_timestamp&desc=true`
      ).then((resp) => resp.redemptions);
    };

    return paginate(fs, 1, 100);
  }

  // Individual trove endpoints
  public async getTroves(
    chain: string,
    manager: string,
    orderBy:
      | "last_update"
      | "created_at"
      | "collateral_ratio"
      | "collateral_usd"
      | "debt"
      | "owner"
  ): Promise<Trove[]> {
    const fs = (page: number) => {
      return this.fetch<{
        page: number;
        total_entries: number;
        troves: Trove[];
      }>(
        `${API_URL}/trove/${chain}/${manager}/troves?items=100&page=${page}&order_by=${orderBy}&desc=true`
      ).then((resp) => resp.troves);
    };

    return paginate(fs, 1, 100);
  }

  public async getTroveSnapshots(
    chain: string,
    manager: string,
    owner: string
  ): Promise<{ snapshots: TroveSnapshotData[] }> {
    return this.fetch(
      `${API_URL}/trove/${chain}/${manager}/snapshots/${owner}`
    );
  }

  public async getTroveDetail(
    chain: string,
    manager: string,
    owner: string
  ): Promise<Trove> {
    return this.fetch(`${API_URL}/trove/${chain}/${manager}/${owner}`);
  }

  public async getTroveHistory(
    chain: string,
    manager: string,
    owner: string
  ): Promise<{ snapshots: TroveHistoryData[] }> {
    return this.fetch(`${API_URL}/trove/${chain}/${manager}/history/${owner}`);
  }

  public async getTroveRank(
    chain: string,
    manager: string,
    owner: string
  ): Promise<RatioPosition> {
    return this.fetch(`${API_URL}/trove/${chain}/${manager}/rank/${owner}`);
  }
}
