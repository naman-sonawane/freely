"use client"

import type React from "react"
import { useState, useEffect } from "react"
import axios from "axios"
import Cookies from "js-cookie"
import PlusIcon from "./assets/Plus.svg"
import CloseIcon from "./assets/Close.svg"
import AppNavbar from "../App Navbar/AppNavbar"
import { Navigate } from "react-router-dom"
import { Pie, Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from "chart.js"

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title)

interface Asset {
  id: string
  name: string
  type: "stock" | "bond" | "natural_resource" | "other"
  value: number
  purchaseDate: string
  quantity?: number
  currentPrice?: number
}

const Profile: React.FC = () => {
  const [stockInterests, setStockInterests] = useState<string[]>([])
  const [portfolioGoals, setPortfolioGoals] = useState<string[]>([])
  const [assets, setAssets] = useState<Asset[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState("")
  const [newItem, setNewItem] = useState("")
  const [isButtonEnabled, setIsButtonEnabled] = useState(false)
  const [activeTab, setActiveTab] = useState("interests")

  // New asset form state
  const [newAsset, setNewAsset] = useState<Partial<Asset>>({
    name: "",
    type: "stock",
    value: 0,
    quantity: 1,
    purchaseDate: new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    const fetchProfileData = async () => {
      const username = Cookies.get("username")

      if (!username) {
        console.error("Username not found in cookies")
        return
      }

      try {
        const response = await axios.get(import.meta.env.VITE_BACKEND_URL + "/api/users/profile", {
          params: { username },
        })
        const { interests, goals, assets = [] } = response.data
        setStockInterests(interests)
        setPortfolioGoals(goals)
        setAssets(assets)
      } catch (error) {
        console.error("Error fetching profile data:", error)
      }
    }

    fetchProfileData()
  }, [])

  const openModal = (title: string) => {
    setModalTitle(title)
    setIsModalOpen(true)

    // Reset form states based on modal type
    if (title === "Add Asset") {
      setNewAsset({
        name: "",
        type: "stock",
        value: 0,
        quantity: 1,
        purchaseDate: new Date().toISOString().split("T")[0],
      })
    } else {
      setNewItem("")
    }

    setIsButtonEnabled(false)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setNewItem("")
    setNewAsset({
      name: "",
      type: "stock",
      value: 0,
      quantity: 1,
      purchaseDate: new Date().toISOString().split("T")[0],
    })
    setIsButtonEnabled(false)
  }

  const handleInputChange = (value: string) => {
    setNewItem(value)
    setIsButtonEnabled(value.trim() !== "")
  }

  const handleAssetInputChange = (field: keyof Asset, value: string) => {
    setNewAsset((prev) => {
      const updated = { ...prev, [field]: value }
      // Enable button if name is not empty and value is valid
      const isValid = updated.name && updated.name.trim() !== "" && updated.value !== undefined && updated.value > 0

      setIsButtonEnabled(isValid || false)
      return updated
    })
  }

  const handleAddItem = async () => {
    if (newItem.trim()) {
      if (modalTitle === "Add Stock Interest") {
        setStockInterests([...stockInterests, newItem])
        await updateUserProfile([...stockInterests, newItem], portfolioGoals, assets)
      } else if (modalTitle === "Add Portfolio Goal") {
        setPortfolioGoals([...portfolioGoals, newItem])
        await updateUserProfile(stockInterests, [...portfolioGoals, newItem], assets)
      }
      closeModal()
    }
  }

  const handleAddAsset = async () => {
    if (newAsset.name && newAsset.value && newAsset.type) {
      const assetToAdd: Asset = {
        id: Date.now().toString(), // Simple ID generation
        name: newAsset.name,
        type: newAsset.type as "stock" | "bond" | "natural_resource" | "other",
        value: Number(newAsset.value),
        purchaseDate: newAsset.purchaseDate || new Date().toISOString().split("T")[0],
        quantity: newAsset.quantity,
        currentPrice: newAsset.type === "stock" ? Number(newAsset.value) / Number(newAsset.quantity) : undefined,
      }

      const updatedAssets = [...assets, assetToAdd]
      setAssets(updatedAssets)
      await updateUserProfile(stockInterests, portfolioGoals, updatedAssets)
      closeModal()
    }
  }

  const handleDeleteItem = async (index: number, type: string) => {
    if (type === "interest") {
      const updatedInterests = stockInterests.filter((_, i) => i !== index)
      setStockInterests(updatedInterests)
      await updateUserProfile(updatedInterests, portfolioGoals, assets)
    } else if (type === "goal") {
      const updatedGoals = portfolioGoals.filter((_, i) => i !== index)
      setPortfolioGoals(updatedGoals)
      await updateUserProfile(stockInterests, updatedGoals, assets)
    } else if (type === "asset") {
      const updatedAssets = assets.filter((_, i) => i !== index)
      setAssets(updatedAssets)
      await updateUserProfile(stockInterests, portfolioGoals, updatedAssets)
    }
  }

  const updateUserProfile = async (interests: string[], goals: string[], assets: Asset[]) => {
    const username = Cookies.get("username")

    if (!username) {
      console.error("Username not found in cookies")
      return
    }

    try {
      const response = await axios.put(import.meta.env.VITE_BACKEND_URL + "/api/users/profile", {
        username,
        interests,
        goals,
        assets,
      })
      console.log(response.data.message)
    } catch (error) {
      console.error("Error updating profile:", error)
    }
  }

  // Calculate portfolio distribution data for pie chart
  const getPortfolioDistributionData = () => {
    const assetTypeMap: Record<string, number> = {
      stock: 0,
      bond: 0,
      natural_resource: 0,
      other: 0,
    }

    assets.forEach((asset) => {
      assetTypeMap[asset.type] += asset.value
    })

    return {
      labels: ["Stocks", "Bonds", "Natural Resources", "Other"],
      datasets: [
        {
          data: [assetTypeMap.stock, assetTypeMap.bond, assetTypeMap.natural_resource, assetTypeMap.other],
          backgroundColor: [
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(75, 192, 192, 0.6)",
            "rgba(153, 102, 255, 0.6)",
          ],
          borderColor: [
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
          ],
          borderWidth: 1,
        },
      ],
    }
  }

  // Sample data for portfolio growth trend
  const getPortfolioTrendData = () => {
    // In a real app, this would come from historical data
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]

    return {
      labels: months,
      datasets: [
        {
          label: "Portfolio Value ($)",
          data: [
            assets.reduce((sum, asset) => sum + asset.value * 0.85, 0),
            assets.reduce((sum, asset) => sum + asset.value * 0.9, 0),
            assets.reduce((sum, asset) => sum + asset.value * 0.95, 0),
            assets.reduce((sum, asset) => sum + asset.value * 0.97, 0),
            assets.reduce((sum, asset) => sum + asset.value * 0.99, 0),
            assets.reduce((sum, asset) => sum + asset.value, 0),
          ],
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    }
  }

  const getTotalPortfolioValue = () => {
    return assets
      .reduce((total, asset) => total + asset.value, 0)
      .toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      })
  }

  if (!Cookies.get("username")) {
    return <Navigate to="/login" />
  }

  return (
    <div className="relative min-h-screen w-screen overflow-x-hidden">
      <div className="w-screen z-10">
        <AppNavbar />
      </div>

      <div className="flex flex-col p-6 w-screen max-w-screen mx-auto">
        {/* Tab Navigation */}
        <div className="flex w-screen mb-6 border-b">
          <button
            className={`py-2 px-4 font-medium ${activeTab === "interests" ? "text-[#00695C] border-b-2 border-[#00695C]" : "text-gray-500"}`}
            onClick={() => setActiveTab("interests")}
          >
            Interests & Goals
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === "portfolio" ? "text-[#00695C] border-b-2 border-[#00695C]" : "text-gray-500"}`}
            onClick={() => setActiveTab("portfolio")}
          >
            Portfolio
          </button>
        </div>

        {activeTab === "interests" && (
          <div className="flex flex-col md:flex-row items-start justify-between w-full space-y-6 md:space-y-0 md:space-x-6">
            <div className="p-4 bg-white rounded-lg shadow-sm w-full md:w-5/12 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg md:text-xl font-semibold text-[#00695C]">Stock Interests</h2>
                <div
                  className="text-white cursor-pointer transform transition-transform duration-200 hover:scale-110"
                  onClick={() => openModal("Add Stock Interest")}
                >
                  <img src={PlusIcon || "/placeholder.svg"} alt="Add" className="w-6 h-6" />
                </div>
              </div>
              <p className="text-gray-500 mb-4">Add stocks or sectors to personalize your market news feed.</p>
              <div className="flex flex-col gap-2 overflow-y-auto pr-4" style={{ flexGrow: 1 }}>
                {stockInterests.map((interest, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center px-4 py-2 bg-gray-100 rounded-lg border border-gray-300"
                  >
                    <span className="inline-block">{interest}</span>
                    <img
                      src={CloseIcon || "/placeholder.svg"}
                      alt="Delete"
                      className="w-4 h-4 cursor-pointer"
                      onClick={() => handleDeleteItem(index, "interest")}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-white rounded-lg shadow-sm w-full md:w-5/12 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg md:text-xl font-semibold text-[#00695C]">Portfolio Goals</h2>
                <div
                  className="text-white cursor-pointer transform transition-transform duration-200 hover:scale-110"
                  onClick={() => openModal("Add Portfolio Goal")}
                >
                  <img src={PlusIcon || "/placeholder.svg"} alt="Add" className="w-6 h-6" />
                </div>
              </div>
              <p className="text-gray-500 mb-4">
                Set your investment goals. This helps us tailor your news feed to your financial objectives.
              </p>
              <div className="flex flex-col gap-2 overflow-y-auto pr-4" style={{ flexGrow: 1 }}>
                {portfolioGoals.map((goal, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center px-4 py-2 bg-gray-100 rounded-lg border border-gray-300"
                  >
                    <span className="inline-block">{goal}</span>
                    <img
                      src={CloseIcon || "/placeholder.svg"}
                      alt="Delete"
                      className="w-4 h-4 cursor-pointer"
                      onClick={() => handleDeleteItem(index, "goal")}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "portfolio" && (
          <div className="flex flex-col w-full space-y-6">
            {/* Portfolio Summary */}
            <div className="p-4 bg-white rounded-lg shadow-sm w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg md:text-xl font-semibold text-[#00695C]">Portfolio Summary</h2>
                <div
                  className="text-white cursor-pointer transform transition-transform duration-200 hover:scale-110"
                  onClick={() => openModal("Add Asset")}
                >
                  <img src={PlusIcon || "/placeholder.svg"} alt="Add" className="w-6 h-6" />
                </div>
              </div>
              <p className="text-gray-500 mb-4">
                Total Portfolio Value: <span className="font-bold">{getTotalPortfolioValue()}</span>
              </p>

              {/* Portfolio Charts */}
              <div className="grid md:grid-cols-2 gap-6 mt-6 w-full">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-md font-semibold text-[#00695C] mb-4">Asset Distribution</h3>
                  <div className="h-64">
                    {assets.length > 0 ? (
                      <Pie data={getPortfolioDistributionData()} />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        Add assets to see distribution
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-md font-semibold text-[#00695C] mb-4">Portfolio Trend</h3>
                  <div className="h-64">
                    {assets.length > 0 ? (
                      <Line
                        data={getPortfolioTrendData()}
                        options={{
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: false,
                            },
                          },
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        Add assets to see trend
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Assets List */}
              <div className="mt-6 w-full">
                <h3 className="text-md font-semibold text-[#00695C] mb-4">Your Assets</h3>
                {assets.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                      <thead>
                        <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                          <th className="py-3 px-6 text-left">Name</th>
                          <th className="py-3 px-6 text-left">Type</th>
                          <th className="py-3 px-6 text-right">Quantity</th>
                          <th className="py-3 px-6 text-right">Value</th>
                          <th className="py-3 px-6 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-600 text-sm">
                        {assets.map((asset, index) => (
                          <tr key={asset.id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="py-3 px-6 text-left">{asset.name}</td>
                            <td className="py-3 px-6 text-left capitalize">{asset.type.replace("_", " ")}</td>
                            <td className="py-3 px-6 text-right">{asset.quantity || "-"}</td>
                            <td className="py-3 px-6 text-right">
                              {asset.value.toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD",
                              })}
                            </td>
                            <td className="py-3 px-6 text-center">
                              <img
                                src={CloseIcon || "/placeholder.svg"}
                                alt="Delete"
                                className="w-4 h-4 cursor-pointer inline-block"
                                onClick={() => handleDeleteItem(index, "asset")}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No assets added yet. Click the + button to add your first asset.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal for adding items */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-96 relative p-6">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-semibold">{modalTitle}</h1>
                <div className="cursor-pointer" onClick={closeModal}>
                  <img src={CloseIcon || "/placeholder.svg"} alt="Close" className="w-6 h-6" />
                </div>
              </div>

              {modalTitle === "Add Asset" ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Asset Name</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="e.g., Apple Inc., Gold, Treasury Bond"
                      value={newAsset.name || ""}
                      onChange={(e) => handleAssetInputChange("name", e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Asset Type</label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded"
                      value={newAsset.type}
                      onChange={(e) => handleAssetInputChange("type", e.target.value)}
                    >
                      <option value="stock">Stock</option>
                      <option value="bond">Bond</option>
                      <option value="natural_resource">Natural Resource</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {newAsset.type === "stock" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={newAsset.quantity || ""}
                        onChange={(e) => handleAssetInputChange("quantity", Number.parseFloat(e.target.value))}
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Value ($)</label>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="Current market value"
                      value={newAsset.value || ""}
                      onChange={(e) => handleAssetInputChange("value", Number.parseFloat(e.target.value))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Date</label>
                    <input
                      type="date"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={newAsset.purchaseDate || ""}
                      onChange={(e) => handleAssetInputChange("purchaseDate", e.target.value)}
                    />
                  </div>

                  <div
                    className={`text-white cursor-pointer text-center py-2 px-4 rounded ${
                      isButtonEnabled ? "bg-green-600 hover:bg-green-700" : "bg-gray-400"
                    } transition-colors`}
                    onClick={isButtonEnabled ? handleAddAsset : undefined}
                  >
                    Add Asset
                  </div>
                </div>
              ) : (
                <>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                    placeholder={`Enter new ${modalTitle.toLowerCase().replace("add ", "").replace("stock ", "")}`}
                    value={newItem}
                    onChange={(e) => handleInputChange(e.target.value)}
                  />
                  <div
                    className={`text-white cursor-pointer text-center py-2 px-4 rounded ${
                      isButtonEnabled ? "bg-green-600 hover:bg-green-700" : "bg-gray-400"
                    } transition-colors`}
                    onClick={isButtonEnabled ? handleAddItem : undefined}
                  >
                    Add
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile

