"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Monster } from "@/lib/db/types";

interface StatBlockProps {
  monster: Monster;
}

export function StatBlock({ monster }: StatBlockProps) {
  const getAbilityModifier = (score: number): string => {
    const mod = Math.floor((score - 10) / 2);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl">{monster.name}</CardTitle>
            <p className="text-muted-foreground">
              {monster.size && `${monster.size} `}
              {monster.type}
              {monster.alignment && `, ${monster.alignment}`}
            </p>
          </div>
          {monster.cr && (
            <Badge variant="outline" className="text-lg">
              CR {monster.cr}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Separator />

        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-semibold">Armor Class</span>
            <p>{monster.ac}</p>
          </div>
          <div>
            <span className="font-semibold">Hit Points</span>
            <p>{monster.max_hp}</p>
          </div>
          <div>
            <span className="font-semibold">Speed</span>
            <p>{monster.speed || "—"}</p>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="font-semibold mb-2">Ability Scores</h3>
          <div className="grid grid-cols-6 gap-2 text-sm">
            <div className="text-center">
              <div className="font-semibold">STR</div>
              <div>{monster.stats.str}</div>
              <div className="text-muted-foreground">
                ({getAbilityModifier(monster.stats.str)})
              </div>
            </div>
            <div className="text-center">
              <div className="font-semibold">DEX</div>
              <div>{monster.stats.dex}</div>
              <div className="text-muted-foreground">
                ({getAbilityModifier(monster.stats.dex)})
              </div>
            </div>
            <div className="text-center">
              <div className="font-semibold">CON</div>
              <div>{monster.stats.con}</div>
              <div className="text-muted-foreground">
                ({getAbilityModifier(monster.stats.con)})
              </div>
            </div>
            <div className="text-center">
              <div className="font-semibold">INT</div>
              <div>{monster.stats.int}</div>
              <div className="text-muted-foreground">
                ({getAbilityModifier(monster.stats.int)})
              </div>
            </div>
            <div className="text-center">
              <div className="font-semibold">WIS</div>
              <div>{monster.stats.wis}</div>
              <div className="text-muted-foreground">
                ({getAbilityModifier(monster.stats.wis)})
              </div>
            </div>
            <div className="text-center">
              <div className="font-semibold">CHA</div>
              <div>{monster.stats.cha}</div>
              <div className="text-muted-foreground">
                ({getAbilityModifier(monster.stats.cha)})
              </div>
            </div>
          </div>
        </div>

        {(monster.damage_resistances?.length ||
          monster.damage_immunities?.length ||
          monster.condition_immunities?.length) && (
          <>
            <Separator />
            <div className="space-y-2 text-sm">
              {monster.damage_resistances && monster.damage_resistances.length > 0 && (
                <div>
                  <span className="font-semibold">Damage Resistances</span>
                  <p className="text-muted-foreground">{monster.damage_resistances.join(", ")}</p>
                </div>
              )}
              {monster.damage_immunities && monster.damage_immunities.length > 0 && (
                <div>
                  <span className="font-semibold">Damage Immunities</span>
                  <p className="text-muted-foreground">{monster.damage_immunities.join(", ")}</p>
                </div>
              )}
              {monster.condition_immunities && monster.condition_immunities.length > 0 && (
                <div>
                  <span className="font-semibold">Condition Immunities</span>
                  <p className="text-muted-foreground">{monster.condition_immunities.join(", ")}</p>
                </div>
              )}
            </div>
          </>
        )}

        {monster.senses && (
          <>
            <Separator />
            <div className="text-sm">
              <span className="font-semibold">Senses</span>
              <p className="text-muted-foreground">{monster.senses}</p>
            </div>
          </>
        )}

        {monster.languages && (
          <>
            <Separator />
            <div className="text-sm">
              <span className="font-semibold">Languages</span>
              <p className="text-muted-foreground">{monster.languages}</p>
            </div>
          </>
        )}

        {monster.actions && monster.actions.length > 0 && (
          <>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2">Actions</h3>
              <div className="space-y-2">
                {monster.actions.map((action, index) => (
                  <div key={index} className="text-sm">
                    <div className="font-semibold">{action.name}</div>
                    <p className="text-muted-foreground">{action.description}</p>
                    {action.attack_bonus && (
                      <p className="text-muted-foreground">
                        <span className="font-semibold">Attack:</span> +{action.attack_bonus}
                      </p>
                    )}
                    {action.damage && (
                      <p className="text-muted-foreground">
                        <span className="font-semibold">Damage:</span> {action.damage}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {monster.notes && (
          <>
            <Separator />
            <div className="text-sm">
              <span className="font-semibold">Notes</span>
              <p className="text-muted-foreground">{monster.notes}</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
