import { type Page } from "@/Framework/Monitor";

import Vaults from "@PM/Pages/Vaults/Vaults.vue";
import StabilityPool from "@PM/Pages/Pool/StabilityPool.vue";
import Stablecoin from "@PM/Pages/Stablecoin/Stablecoin.vue";
import VaultManager from "@PM/Pages/Vaults/VaultManager.vue";
import Trove from "@PM/Pages/Vaults/Trove.vue";

export const pageMain: Page = {
  titleRoute: "/",
  routes: [
    { path: "/", redirect: { name: "vaults" } },

    { path: "/pool", name: "pool", component: StabilityPool },
    { path: "/mkusd", name: "mkusd", component: Stablecoin },
    { path: "/vaults", name: "vaults", component: Vaults },
    {
      path: "/vault/:vaultAddr/:tab?",
      name: "prismavault",
      component: VaultManager,
    },
    {
      path: "/vault/:vaultAddr/trove/:troveAddr",
      name: "prismatrove",
      component: Trove,
    },
  ],
  menuItems: [
    {
      to: "/vaults",
      label: "Vaults",
    },
    {
      to: "/mkusd",
      label: "mkUSD",
    },
    {
      to: "/pool",
      label: "Stability pool",
    },
  ],
};
