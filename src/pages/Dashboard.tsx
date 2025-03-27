
import { useState, useEffect } from "react";
import { 
  DropletIcon, 
  AlertTriangleIcon, 
  CheckCircleIcon, 
  CloudRainIcon,
  ThermometerIcon,
  BarChartIcon,
  WindIcon,
  Eye,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";

// Mock feature names similar to what would be loaded from feature_names.pkl
const mockFeatureNames = [
  "Rainfall (mm)",
  "Water Level (m)",
  "Temperature (°C)",
  "Humidity (%)",
  "Wind Speed (km/h)",
  "River Discharge (m³/s)",
  "Soil Moisture (%)",
  "Elevation (m)"
];

// Mapping feature names to icons
const featureIcons: { [key: string]: any } = {
  "Rainfall (mm)": CloudRainIcon,
  "Water Level (m)": DropletIcon,
  "Temperature (°C)": ThermometerIcon,
  "Humidity (%)": Eye,
  "Wind Speed (km/h)": WindIcon,
  "River Discharge (m³/s)": BarChartIcon,
  "Soil Moisture (%)": Eye,
  "Elevation (m)": BarChartIcon
};

// Feature default and range values
const featureDefaults: { [key: string]: {default: number, min: number, max: number, step: number} } = {
  "Rainfall (mm)": {default: 50, min: 0, max: 300, step: 1},
  "Water Level (m)": {default: 2, min: 0, max: 10, step: 0.1},
  "Temperature (°C)": {default: 25, min: -10, max: 50, step: 0.5},
  "Humidity (%)": {default: 60, min: 0, max: 100, step: 1},
  "Wind Speed (km/h)": {default: 15, min: 0, max: 150, step: 1},
  "River Discharge (m³/s)": {default: 100, min: 0, max: 1000, step: 5},
  "Soil Moisture (%)": {default: 40, min: 0, max: 100, step: 1},
  "Elevation (m)": {default: 50, min: 0, max: 500, step: 1}
};

const Dashboard = () => {
  const { toast: uiToast } = useToast();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [featureValues, setFeatureValues] = useState<{[key: string]: number}>({});
  const [predictionResult, setPredictionResult] = useState<string | null>(null);
  const [aiInsights, setAiInsights] = useState<string | null>(null);
  
  useEffect(() => {
    // Set default values for features
    const defaults: {[key: string]: number} = {};
    mockFeatureNames.forEach(name => {
      defaults[name] = featureDefaults[name]?.default || 0;
    });
    setFeatureValues(defaults);
    
    // Animation delay
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);
  
  const handleSliderChange = (name: string, value: number[]) => {
    setFeatureValues(prev => ({
      ...prev,
      [name]: value[0]
    }));
  };

  const handleReset = () => {
    // Reset to default values
    const defaults: {[key: string]: number} = {};
    mockFeatureNames.forEach(name => {
      defaults[name] = featureDefaults[name]?.default || 0;
    });
    setFeatureValues(defaults);
    setPredictionResult(null);
    setAiInsights(null);
    
    toast.success("All parameters have been reset to default values");
  };

  const handlePredict = () => {
    setIsSubmitting(true);
    
    // Simulate API call to the ML model backend
    setTimeout(() => {
      // Mock the prediction result (random for demo purposes)
      const isHighRisk = Math.random() > 0.5;
      const result = isHighRisk 
        ? "🚨 High Flood Risk Level!" 
        : "✅ Low Flood Risk Level.";
      
      setPredictionResult(result);
      
      // Mock AI insights
      const insights = `
      🔍 Flood Prediction Analysis:
      
      Based on the provided environmental data, our model has identified the following:
      
      ${isHighRisk ? "⚠️ Key risk factors:" : "✓ Favorable conditions:"}
      ${isHighRisk 
        ? `• The rainfall value of ${featureValues["Rainfall (mm)"]}mm exceeds critical thresholds.
        • Water level at ${featureValues["Water Level (m)"]}m is approaching concerning levels.
        • Current humidity levels (${featureValues["Humidity (%)"]}%) indicate saturated conditions.`
        : `• Rainfall at ${featureValues["Rainfall (mm)"]}mm is below flood-triggering levels.
        • Current water level of ${featureValues["Water Level (m)"]}m is within safe parameters.
        • Temperature and humidity conditions remain favorable.`
      }
      
      Recommendations:
      ${isHighRisk
        ? "• Monitor precipitation forecasts closely in the next 24-48 hours.\n• Consider implementing early warning procedures.\n• Evaluate drainage systems in potentially affected areas."
        : "• Continue regular monitoring of environmental conditions.\n• No immediate action required based on current parameters.\n• Maintain standard preparedness protocols."
      }
      `;
      
      setAiInsights(insights);
      setIsSubmitting(false);
      
      // Show toast notification
      if (isHighRisk) {
        uiToast({
          variant: "destructive",
          title: "High Flood Risk Detected",
          description: "Review the AI insights for detailed analysis and recommendations."
        });
      } else {
        uiToast({
          title: "Low Flood Risk Detected",
          description: "Current conditions show minimal flood risk. See AI insights for details."
        });
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />
      
      <main className="flex-grow pt-20 pb-10">
        <div className="container mx-auto px-4 sm:px-6 py-8">
          {/* Header */}
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Flood Risk Prediction Dashboard</h1>
            <p className="text-lg text-gray-600">
              Adjust environmental parameters to predict flood risk levels with AI-generated insights.
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="parameters" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="parameters" className="text-sm sm:text-base">Input Parameters</TabsTrigger>
                <TabsTrigger value="results" className="text-sm sm:text-base">Prediction Results</TabsTrigger>
              </TabsList>
              
              <TabsContent value="parameters" className={`space-y-8 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mockFeatureNames.map((name, i) => {
                    const IconComponent = featureIcons[name] || Eye;
                    const { min, max, step } = featureDefaults[name] || { min: 0, max: 100, step: 1 };
                    
                    return (
                      <Card key={name} className="overflow-hidden hover:shadow-md transition-shadow border border-gray-200">
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                              <IconComponent className="h-4 w-4 text-primary" />
                            </div>
                            <CardTitle className="text-lg">{name}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-col gap-6">
                            <Slider 
                              value={[featureValues[name] || 0]} 
                              min={min}
                              max={max}
                              step={step}
                              onValueChange={(value) => handleSliderChange(name, value)}
                              className="mt-2" 
                            />
                            <div className="text-center font-mono text-lg font-medium">
                              {featureValues[name]?.toFixed(step < 1 ? 1 : 0)}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                  <Button 
                    onClick={handlePredict}
                    className="bg-primary hover:bg-primary/90 text-white rounded-xl py-6 px-8 shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all font-medium"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        Generate Prediction <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleReset}
                    className="rounded-xl py-6 px-8 border-gray-300 hover:bg-gray-50"
                    disabled={isSubmitting}
                  >
                    Reset Parameters
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="results" className="space-y-6">
                {predictionResult ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className={`overflow-hidden border-2 ${predictionResult.includes("High") ? "border-red-300" : "border-green-300"} animate-fade-in`}>
                      <CardHeader className={`${predictionResult.includes("High") ? "bg-red-50" : "bg-green-50"}`}>
                        <CardTitle className="flex items-center gap-2">
                          {predictionResult.includes("High") ? (
                            <AlertTriangleIcon className="h-5 w-5 text-red-500" />
                          ) : (
                            <CheckCircleIcon className="h-5 w-5 text-green-500" />
                          )}
                          Prediction Result
                        </CardTitle>
                        <CardDescription>
                          Based on the input parameters
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className={`text-xl font-medium ${predictionResult.includes("High") ? "text-red-600" : "text-green-600"}`}>
                          {predictionResult}
                        </div>
                        <p className="mt-4 text-gray-600">
                          {predictionResult.includes("High") 
                            ? "The model has detected conditions that indicate a high probability of flooding. Immediate attention and preventive measures are recommended."
                            : "The model indicates favorable conditions with a low probability of flooding. Standard monitoring procedures are advised."}
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card className="overflow-hidden border-2 border-blue-200 animate-fade-in" style={{ animationDelay: "150ms" }}>
                      <CardHeader className="bg-blue-50">
                        <CardTitle className="flex items-center gap-2">
                          <BrainIcon className="h-5 w-5 text-blue-500" />
                          AI Insights
                        </CardTitle>
                        <CardDescription>
                          Powered by Google Gemini
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="whitespace-pre-line text-gray-800 font-light">
                          {aiInsights}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="text-center p-12 bg-white rounded-xl border border-gray-200">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BarChartIcon className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Prediction Results Yet</h3>
                    <p className="text-gray-600 mb-6">
                      Adjust the input parameters and generate a prediction to see results and AI insights here.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => document.querySelector('button[value="parameters"]')?.click()}
                      className="rounded-full"
                    >
                      Go to Parameters
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <footer className="py-6 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <DropletIcon className="h-6 w-6 text-primary mr-2" />
              <span className="text-gray-600 text-sm">
                FloodWise<span className="font-light">AI</span>
              </span>
            </div>
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} FloodWiseAI. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
